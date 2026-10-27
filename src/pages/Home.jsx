import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { IoMdSearch as SearchIcon } from "react-icons/io";
import PropertyCard from "../components/PropertyCard";
import { useTheme } from "../context/ThemeContext.jsx";

import cozyHomeBg from "../assets/images/cozy-home-bg.jpeg";
import cozyHomeBgOffWhite from "../assets/images/cozy-home-bg2.jpeg";

const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const Home = () => {
  const { theme } = useTheme();

  const [properties, setProperties] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState("");

  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  const [activeCity, setActiveCity] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const backgroundImage =
    theme === "offwhite" ? cozyHomeBgOffWhite : cozyHomeBg;

  const fetchProperties = async (cityQuery = "") => {
    try {
      setloading(true);
      setError("");

      const response = await axiosClient.get(
        cityQuery
          ? `/properties?location=${encodeURIComponent(cityQuery)}`
          : "/properties"
      );

      setProperties(response.data.properties || response.data || []);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperties();
  }, []);

  const locationChanges = (e) => {
    const value = e.target.value;

    setSearchData((prev) => ({
      ...prev,
      location: value,
    }));

    setSearchMessage("");
    setDropDown(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 3) {
      setSuggestion([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get("https://photon.komoot.io/api/", {
          params: {
            q: value.trim(),
            limit: 10,
            lat: 30.3753,
            lon: 69.3451,
          },
        });

        const features = res.data?.features || [];

        const isPakistan = (p) =>
          (p?.countrycode || "").toLowerCase() === "pk" ||
          (p?.country || "").toLowerCase() === "pakistan";

        const pkOnly = features.filter((f) => isPakistan(f.properties));
        const finalFeatures = pkOnly.length > 0 ? pkOnly : features;

        const geoResults = finalFeatures.slice(0, 8).map((f) => {
          const p = f.properties || {};

          return [p.name, p.city, p.state, p.country]
            .filter(Boolean)
            .join(", ");
        });

        setSuggestion(Array.from(new Set(geoResults)));
      } catch (err) {
        console.error("Error fetching geocoded locations:", err);
        setSuggestion([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 400);
  };

  const handleFocus = () => {
    setDropDown(true);
  };

  useEffect(() => {
    const clickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropDown(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);

  return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const selectCity = (city) => {
    setSearchData((prev) => ({
      ...prev,
      location: city,
    }));

    setDropDown(false);
    setSearchMessage("");
  };

  const inputChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ADDRESS_NOISE_WORDS = [
    "pakistan",
    "punjab",
    "sindh",
    "khyber pakhtunkhwa",
    "kpk",
    "balochistan",
    "islamabad capital territory",
    "azad kashmir",
    "gilgit-baltistan",
    "gilgit baltistan",
  ];

  const cityHasProperties = (locationStr) => {
    const parts = locationStr
      .split(",")
      .map((p) => p.trim().toLowerCase())
      .filter(
        (p) =>
          p &&
          !/^\d+$/.test(p) &&
          !ADDRESS_NOISE_WORDS.includes(p)
      );

    if (parts.length === 0) return true;

    return properties.some((property) => {
      const city = (
        property.address?.city ||
        property.city ||
        ""
      ).toLowerCase();

      const area = (property.address?.area || "").toLowerCase();

      if (!city && !area) return false;

      return parts.some(
        (part) =>
          (city && (city.includes(part) || part.includes(city))) ||
          (area && (area.includes(part) || part.includes(area)))
      );
    });
  };

  const search = (e) => {
    e.preventDefault();

    const selectCityVal = searchData.location.trim();

    if (selectCityVal) {
      if (!cityHasProperties(selectCityVal)) {
        setSearchMessage(
          `No properties available in "${selectCityVal}" yet. Browse listings from other cities below.`
        );

        return;
      }

      setSearchMessage("");

      const params = new URLSearchParams();

      params.set("location", selectCityVal);

      if (searchData.checkIn) {
        params.set("checkIn", searchData.checkIn);
      }

      if (searchData.checkOut) {
        params.set("checkOut", searchData.checkOut);
      }

      if (searchData.guests) {
        params.set("guests", searchData.guests);
      }

      navigate(`/properties?${params.toString()}`);
    } else {
      setSearchMessage("");
      setActiveCity("");
      fetchProperties();
    }
  };

  const GProperty = properties.reduce((acc, property) => {
    const rawCity =
      property.address?.city ||
      property.city ||
      "Other Cities";

    const key = rawCity.trim().toLowerCase();

    if (!acc[key]) {
      acc[key] = {
        label: capitalizeWords(rawCity.trim()),
        items: [],
      };
    }

    acc[key].items.push(property);

    return acc;
  }, {});

  return (
    <>
      <style>{`
        .home-hero-copy,
        .home-hero-copy:hover,
        .home-hero-copy:focus,
        .home-hero-copy:active {
          color: var(--theme-text) !important;
        }

        .home-hero-copy *,
        .home-hero-copy *:hover,
        .home-hero-copy *:focus,
        .home-hero-copy *:active {
          color: inherit !important;
          text-decoration: none !important;
          transition: none !important;
        }

        .home-hero-text,
        .home-hero-text:hover,
        .home-hero-text:focus,
        .home-hero-text:active {
          color: var(--theme-text) !important;
          pointer-events: none !important;
        }

        .home-hero-accent,
        .home-hero-accent:hover,
        .home-hero-accent:focus,
        .home-hero-accent:active {
          color: var(--theme-accent) !important;
          pointer-events: none !important;
        }

        .home-hero-muted,
        .home-hero-muted:hover,
        .home-hero-muted:focus,
        .home-hero-muted:active {
          color: var(--theme-muted-light) !important;
          pointer-events: none !important;
        }
      `}</style>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${
            theme === "offwhite"
              ? "none"
              : "invert(72%) sepia(25%) saturate(650%) hue-rotate(5deg) brightness(92%) contrast(88%)"
          };
          opacity: 1;
          cursor: pointer;
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          filter: ${
            theme === "offwhite"
              ? "none"
              : "invert(78%) sepia(30%) saturate(750%) hue-rotate(5deg) brightness(98%) contrast(90%)"
          };
        }

        input::placeholder {
          color: var(--theme-muted);
          opacity: 1;
        }
      `}</style>

      <div
        className="w-full min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: "var(--theme-bg)",
          color: "var(--theme-text)",
        }}
      >
        <div
          className="relative overflow-visible px-4 pt-7 pb-20 transition-colors duration-300"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative max-w-7xl mx-auto">
<div
  className="home-hero-copy mx-auto pt-8 md:pt-12 text-center"
  style={{
    color: "var(--theme-text)",
  }}
>
  <p
    className="home-hero-muted text-center font-ancizar font-bold tracking-[0.35em] text-sm md:text-base mb-4"
    style={{
      color: "var(--theme-muted-light)",
    }}
  >
    FIND YOUR NEXT HOME
  </p>

  <h1
    className="home-hero-text text-center text-5xl md:text-7xl font-ancizar font-extrabold tracking-tight max-w-4xl mx-auto"
    style={{
      color: "var(--theme-text)",
    }}
  >
    The Right Place,  Just for You
  </h1>

  <h2
    className="home-hero-accent text-center pt-3 text-lg md:text-4xl font-ancizar font-extrabold tracking-wide"
    style={{
      color: "var(--theme-accent)",
    }}
  >
    Your Comfort, Our Priority
  </h2>

  <p
    className="home-hero-muted text-center pt-4 font-ancizar font-bold tracking-[0.2em] max-w-3xl mx-auto text-base md:text-xl leading-relaxed"
    style={{
      color: "var(--theme-muted-light)",
    }}
  >
    Made for Living. Built on Trust.
  </p>
</div>

            <form
              onSubmit={search}
              className="flex flex-col md:flex-row items-stretch md:items-center mx-auto mt-8 md:mt-10 p-2 rounded-xl max-w-5xl w-full gap-2 md:gap-0 relative z-40 transition-all duration-500 ease-out hover:-translate-y-1"
              style={{
                backgroundColor: "var(--theme-surface)",
                border: "1px solid var(--theme-accent)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 10px 30px rgba(43,33,24,0.15)"
                    : "0 10px 30px rgba(0,0,0,0.30)",
              }}
            >
              <div
                ref={dropdownRef}
                className="relative flex items-center gap-2 flex-[1.5] min-w-0 px-3 md:px-4 py-2.5 md:py-2 md:border-r"
                style={{
                  borderColor: "var(--theme-border)",
                }}
              >
                <FaLocationDot
                  className="text-xl shrink-0"
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />

                <div className="flex flex-col min-w-0 w-full">
                  <label
                    className="text-[13px] font-bold"
                    style={{
                      color: "var(--theme-accent)",
                    }}
                  >
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={searchData.location}
                    onChange={locationChanges}
                    onFocus={handleFocus}
                    placeholder="Where are you going.."
                    className="outline-none text-xs md:text-sm w-full bg-transparent"
                    style={{
                      color: "var(--theme-text)",
                    }}
                    autoComplete="off"
                  />
                </div>

                {dropDown && (
                  <ul
                    className="absolute left-0 top-full mt-2 w-full rounded-lg shadow-2xl z-50 max-h-72 overflow-y-auto py-1"
                    style={{
                      backgroundColor: "var(--theme-surface)",
                      border: "1px solid var(--theme-accent)",
                    }}
                  >
                    {suggestion.length > 0 ? (
                      suggestion.map((city, index) => (
                        <li
                          key={index}
                          onClick={() => selectCity(city)}
                          className="px-4 py-2.5 text-xs md:text-sm cursor-pointer flex items-center gap-2 border-b last:border-none transition"
                          style={{
                            color: "var(--theme-text)",
                            borderColor: "var(--theme-border)",
                          }}
                        >
                          <FaLocationDot
                            className="text-xs shrink-0"
                            style={{
                              color: "var(--theme-accent)",
                            }}
                          />

                          <span className="font-medium">
                            {city}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li
                        className="px-4 py-2.5 text-xs md:text-sm"
                        style={{
                          color: "var(--theme-muted)",
                        }}
                      >
                        {loadingSuggestions
                          ? "Searching..."
                          : searchData.location.trim().length < 3
                            ? "Type at least 3 characters to search"
                            : "No locations found"}
                      </li>
                    )}

                    {loadingSuggestions &&
                      suggestion.length > 0 && (
                        <li
                          className="px-4 py-1.5 text-[10px] text-center"
                          style={{
                            color: "var(--theme-muted)",
                          }}
                        >
                          Searching for more...
                        </li>
                      )}
                  </ul>
                )}
              </div>

            <div
  className="flex items-center gap-2 flex-1 px-3 md:px-4 py-2.5 md:py-2 md:border-r"
  style={{
    borderColor: "var(--theme-border)",
  }}
>
  <SlCalender
    className="text-lg shrink-0"
    style={{
      color: "var(--theme-accent)",
    }}
  />

  <div className="flex flex-col min-w-0">
    <label
      className="text-[13px] font-bold"
      style={{
        color: "var(--theme-accent)",
      }}
    >
      Check-in
    </label>

    <div className="flex items-center gap-2">
      <input
        type="date"
        name="checkIn"
        value={searchData.checkIn}
        onChange={inputChange}
        className="outline-none text-xs bg-transparent w-[145px]"
        style={{
          color: "var(--theme-text)",
        }}
      />
    </div>
  </div>
</div>

<div
  className="flex items-center gap-2 flex-1 px-3 md:px-4 py-2.5 md:py-2"
  style={{
    borderColor: "var(--theme-border)",
  }}
>
  <SlCalender
    className="text-lg shrink-0"
    style={{
      color: "var(--theme-accent)",
    }}
  />

  <div className="flex flex-col min-w-0">
    <label
      className="text-[13px] font-bold"
      style={{
        color: "var(--theme-accent)",
      }}
    >
      Check-out
    </label>

    <div className="flex items-center gap-2">
      <input
        type="date"
        name="checkOut"
        value={searchData.checkOut}
        onChange={inputChange}
        className="outline-none text-xs bg-transparent w-[145px]"
        style={{
          color: "var(--theme-text)",
        }}
      />
    </div>
  </div>
</div>
              <button
                type="submit"
                className="font-extrabold px-5 md:px-6 py-3 rounded-lg flex items-center justify-center gap-2 shrink-0 text-xs md:text-sm cursor-pointer transition-all active:scale-95"
                style={{
                  backgroundColor: "var(--theme-accent)",
                  color: "var(--theme-button-text)",
                }}
              >
                <SearchIcon className="text-lg" />
                Search Property
              </button>
            </form>

            {searchMessage && (
              <p
                className="text-center mt-4 text-sm md:text-base font-semibold max-w-2xl mx-auto rounded-lg py-2.5 px-4 transition-all duration-300"
                style={{
                  color: "var(--theme-accent)",
                  backgroundColor: "var(--theme-surface)",
                  border: "1px solid var(--theme-accent)",
                }}
              >
                {searchMessage}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
          {loading && (
            <div className="text-center py-10">
              <div
                className="animate-spin w-10 h-10 border-4 border-t-transparent rounded-full mx-auto mb-4"
                style={{
                  borderColor: "var(--theme-border)",
                  borderTopColor: "var(--theme-accent)",
                }}
              />

              <p
                className="font-semibold"
                style={{
                  color: "var(--theme-muted)",
                }}
              >
                Loading Listings...
              </p>
            </div>
          )}

          {error && (
            <p className="text-center font-semibold py-10 text-red-400">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            Object.keys(GProperty).length > 0 &&
            Object.entries(GProperty).map(
              ([cityKey, { label, items }]) => (
                <div
                  key={cityKey}
                  className="space-y-4"
                >
                  <div
                    className="flex justify-between items-center border-b pb-2"
                    style={{
                      borderColor: "var(--theme-border)",
                    }}
                  >
                    <h2
                      className="text-2xl font-bold capitalize"
                      style={{
                        color: "var(--theme-text)",
                      }}
                    >
                      Stays in {label}
                    </h2>

                    <button
                      onClick={() =>
                        navigate(
                          `/properties?location=${encodeURIComponent(
                            label
                          )}`
                        )
                      }
                      className="hover:underline text-sm font-bold cursor-pointer transition-colors"
                      style={{
                        color: "var(--theme-accent)",
                      }}
                    >
                      View All in {label} →
                    </button>
                  </div>

                  <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 overflow-x-auto md:overflow-visible pb-3 md:pb-0 snap-x snap-mandatory md:snap-none">
                    {items.map((property) => (
                      <div
                        key={property._id}
                        className="min-w-[82%] sm:min-w-[48%] md:min-w-0 snap-start"
                      >
                        <PropertyCard
                          property={property}
                          imageOnly
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

          {!loading &&
            !error &&
            properties.length === 0 && (
              <p
                className="text-sm text-center"
                style={{
                  color: "var(--theme-muted)",
                }}
              >
                No properties found.
              </p>
            )}
        </div>
      </div>
    </>
  );
};

export default Home;