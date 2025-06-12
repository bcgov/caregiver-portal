import { Button, TextField } from "@bcgov/design-system-react-components";
import "@bcgov/bc-sans/css/BC_Sans.css";
//import "./Profile.css";

export default function Profile() {
  return (
    <div className="profile-container">
      <h1>Your Profile</h1>

      
        <p><strong>Full Name:</strong> Jane Doe</p>
        <p><strong>Email:</strong> jane.doe@example.com</p>
        <p><strong>Phone:</strong> (555) 123-4567</p>
        <p><strong>Address:</strong> 123 Main St, Victoria, BC</p>
     

      <div className="form-section">
        <TextField label="Preferred Name" />
        <TextField label="Pronouns" />
        <TextField label="Languages Spoken" />
      </div>

      <Button variant="primary" style={{ marginTop: "1rem" }}>
        Continue to Application
      </Button>
    </div>
  );
}