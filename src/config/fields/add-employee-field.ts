export const addEmployeeField: FormField[] = [
  {
    name: "fullName",
    label: "Full name",
    placeholder: "Enter full name",
    type: "input",
    size: { md: 6 },
  },

  {
    name: "email",
    label: "Email",
    placeholder: "Enter email",
    type: "input",
    size: { md: 6 },
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter password",
    type: "input",
    size: { md: 6 },
  },
  {
    menuItems: ["Male", "Female", "Other"],
    name: "gender",
    label: "Gender",
    type: "select",
    size: { md: 6 },
  },
  {
    name: "dateOfBirth",
    label: "Date of birth",
    type: "date",
    size: { md: 6 },
  },
  {
    type: "children",
    children: [
      {
        name: "address.number",
        label: "Number address",
        placeholder: "Enter number",
        type: "input",
        size: { md: 6 },
      },

      {
        name: "address.street",
        label: "Street address",
        placeholder: "Enter street address",
        type: "input",
        size: { md: 6 },
      },
      {
        name: "address.ward",
        label: "Ward address",
        placeholder: "Enter ward address",
        type: "input",
        size: { md: 6 },
      },
      {
        name: "address.district",
        label: "District address",
        placeholder: "Enter district address",
        type: "input",
        size: { md: 6 },
      },
      {
        name: "address.city",
        label: "City address",
        placeholder: "Enter city address",
        type: "input",
        size: { md: 6 },
      },
    ],
  },
];
