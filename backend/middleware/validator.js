import { check } from "express-validator"

export const user = (method) => {
  switch (method) {
    case "signup1": {
      return [
        check("email", "email is required.").not().isEmpty(),
      ];
    }
    case "signup2": {
      return [
        check("email", "email is required.").not().isEmpty(),
        check("password", "Age is required.").not().isEmpty(),
      ];
    }
    case "login": {
      return [
        check("email", "email is required.").not().isEmpty(),
        check("password", "password is required.").not().isEmpty(),
      ];
    }
    
    default: {
      return [];
    }
  }
};
