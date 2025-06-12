import { Button, TextField } from "@bcgov/design-system-react-components";
import "@bcgov/bc-sans/css/BC_Sans.css";

export default function Welcome() {
  return (
    <div className="hg-container">
      <section className="hg-hero">
        <div className="hg-hero-text">
          <h1>Apply to be a Caregiver</h1>
          <p>
            The Caregiver Registry provides secure access to applying to be a foster parent in British Columbia.
          </p>
          <iframe
            src="http://localhost:8080/preview"
            title="Application Form"
            width="100%"
            height="800"
            sandbox="allow-scripts allow-same-origin allow-forms"
            style={{ border: 'none' }}
          ></iframe>

        </div>
        <div className="hg-hero-image">
       
          
        </div>
      </section>

    </div>
  );
}