
export interface User {
  email : string,
  givenName : string,
  surname : string,
  googleId : string,
  profilePhotoURL : string,
  lastLogin ?: Date
}

export function initDefaultUser() : User {
  return {
    email : '',
    givenName : '',
    surname : '',
    googleId : '',
    profilePhotoURL : '',
    lastLogin : undefined
  }
}
