export const getNotificationLink = (notification, user)=>{
    if(!notification) return "/notification";
    const {type, propertyId, bookingId} = notification;
    const role = user = user?.role;
    const propId = propertyId && typeof propertyId === "object"?propertyId._id:propertyId;
    const bookId = bookingId && typeof bookingId === "object"?bookingId._id:bookingId;
    switch(role){
    case "tenant":
    if(type === "Booking"|| type === "Payment") return "/mybooking";
    if(propId)return `/properrty/${propId}`;
    return "/mybooking";
    case "owner":
    if(type === "Booking") return "/pobookings";
    if(type === "Payment") return "/popayments";
    if(type === "Review") return "/poreviews";
    if(type === "New_Listing"|| type === "Verification_Request" || type === "Inspection_Submitted"){
        return "/myproperties";
    }
    return "/owner/dashboard";
    case  "agent":
        if(type === "Verifcation_Request" || type === "Inspecton_Submitted" || type === "new_Listing"){
            return propId?`agentpropertyverification/${propId}`:"/agentpropertyverification";
        }
        return "/agent/dashboard";
        case "admin":
            if(type === "Booking") return "/admin/bookings";
            if(type === "Payment") return "/admin/payments";
            if(type === "Agent_Request") return "/admin/agents";
            if(type === "complaint") return "/admin/support";
            if(type === "Verification_Request" || type === "New_Listing" || type === "Inspection_Submitted"){
                return "/admin/verify-properties";
            }
            return "/admin/dashboard";
            default :return "/notifications";
    }
};
export default getNotificationLink;