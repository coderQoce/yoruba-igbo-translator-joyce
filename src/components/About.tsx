import React from 'react';
import developerImage from '../assets/vincent.jpg'; // Ensure the image exists

const About: React.FC = () => {
  return (
    <div className="about-page">
      <h2 className="about-title">About This Project</h2>

      <div className="about-dev-section">
        <img src={developerImage} alt="Vincent Chidinma Joy" className="about-image" />
        <div className="about-dev-info">
          <p>
            My name is <strong>Vincent Chidinma Joy</strong>, a Computer Science student at
            Oduduwa University, Ile-Ife, Osun State (OUI). I developed this project to empower
            communication between speakers of two of Nigeria’s largest languages.
          </p>
          <p>
            I’m passionate about using technology to solve real-life problems, especially in ways
            that celebrate culture, heritage, and identity.
          </p>
        </div>
      </div>

      <div className="about-project-details">
        <h3>What is YOTOIGB?</h3>
        <p>
          <strong>YoToIgb</strong> is a very simple word-level translator that converts Yoruba words into
          their Igbo and English equivalents using a custom-built local dictionary. It was created
          with accessibility and simplicity in mind — making language translation quick and easy for
          users of all backgrounds.
        </p>

        <h4>Key Features:</h4>;
        <ul>
          <li>📝 Yoruba word input field with full virtual Yoruba keyboard</li>
          <li>🔄 Translates to both Igbo and English</li>
          <li>👩‍💻 Built entirely using React + plain CSS</li>
          <li>🌍 Promotes cultural understanding between major Nigerian languages</li>
        </ul>
      </div>
    </div>
  );
};       

export default About;
