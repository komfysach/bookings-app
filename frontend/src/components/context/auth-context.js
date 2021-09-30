import React from "react";

export default React.createContext({
    token: null,
    adminId: null,
    // patronId: null,
    adminLogin: (token, adminId, tokenExpiration) => { },
    adminLogout: () => { },
});