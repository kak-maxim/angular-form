export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  framework: string;
  frameworkVersion: string;
  email: string;
  hobbies: Hobby[];
}

export interface Hobby {
  name: string;
}