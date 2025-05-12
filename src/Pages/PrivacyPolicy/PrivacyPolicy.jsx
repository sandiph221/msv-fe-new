
import { Container, Grid, makeStyles, Typography } from "@mui/material";
import Styles from "./Styles";

const useStyles = makeStyles((theme) => Styles(theme));

const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <Grid className={classes.row} container>
      <Container style={{ marginTop: 55, marginBottom: 55 }}>
        <div
          id="contact-support-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography style={{ fontSize: 24, fontWeight: 600 }}>
            Privacy Policy
          </Typography>
        </div>
        <Container disableGutters>
          <Grid container alignItems="center" style={{ marginBottom: 4 }}>
            <Typography style={{ fontSize: 12 }}>
              At RavenXAI, we value the privacy of our users. This privacy policy outlines how we collect, use, and protect your information when you use our website and services.
            </Typography>
            <ol style={{ listStyleType: 1 }} className={classes.orderedList}>
              <li style={{ fontWeight: 'bold' }}>Information We Collect</li>
              We collect the following types of information when you use RavenXAI:
              <ul>
                <li style={{ fontWeight: 'bold' }}>Personal Information</li>
                When you create an account, we collect personal details such as your name, email address, and password.
                <li style={{ fontWeight: 'bold' }}>Social Media Data</li>
                By connecting your Facebook and Instagram pages, we collect basic information from these platforms, including:
                <ul>
                  <li>Page details (page name, page ID, followers, etc.)</li>
                  <li>Post and engagement metrics (likes, comments, shares, etc.)</li>
                  <li>Competitor page information if you add them for monitoring purposes</li>
                </ul>
                <li style={{ fontWeight: 'bold' }}>Usage Data</li>
                We collect information about how you interact with our platform, including:
                <ul>
                  <li>Pages viewed</li>
                  <li>Engagement with content (analytics, etc.)</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                </ul>
              </ul>
              <li style={{ fontWeight: 'bold', marginTop: '8px' }}>How We Use Your Information</li>
              The data we collect is used to:
              <ul>
                <li>Provide access to our platform and its features</li>
                <li>Generate and display social media analytics and competitor data</li>
                <li>Improve our website's functionality and user experience</li>
                <li>Respond to customer service inquiries</li>
                <li>Send occasional updates and notifications relevant to your account</li>
              </ul>
              We will never sell your personal information to third parties.
              <li style={{ fontWeight: 'bold', marginTop: '8px' }}>Data Sharing</li>
              <p style={{ textAlign: 'justify' }}>We may share your data with trusted third-party service providers necessary to operate RavenXAI (e.g., cloud storage providers). These third parties are obligated to maintain the confidentiality of your information and use it only for providing the services we require.
                We may also share data if required by law, to protect our legal rights, or in the event of a merger or acquisition.</p>
              <li style={{ fontWeight: 'bold', marginTop: '8px' }}>Data Security</li>
              <p style={{ textAlign: 'justify' }}>We take the security of your data seriously. We implement various measures to protect your personal information from unauthorized access, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
              <li style={{ fontWeight: 'bold', marginTop: '8px' }}>Cookies and Tracking Technologies</li>
              <p style={{ textAlign: 'justify' }}> We use cookies and similar tracking technologies to collect usage data and enhance your experience on our website. You can control cookie settings through your browser, but disabling cookies may affect your ability to use certain features of the platform.</p>
              <li style={{ fontWeight: 'bold', marginTop: '8px' }}>User Rights</li>
              You have the following rights regarding your personal data:
              <ul>
                <li><strong>Access:</strong> You can request access to the data we hold about you.</li>
                <li><strong>Correction:</strong> You can update or correct your personal information at any time.</li>
                <li><strong>Deletion:</strong> You can request that we delete your account and personal data from our systems.</li>
                <li><strong>Opt-Out:</strong> You can opt-out of marketing communications by following the unsubscribe instructions in emails.</li>
              </ul>
              To exercise these rights, please contact us at <strong>[info@ravenxai.com]</strong>.
              <li style={{ fontWeight: 'bold', marginTop: '8px' }}>Third-Party Links</li>
              <p style={{ textAlign: 'justify' }}>Our platform may contain links to third-party websites (such as Facebook and Instagram). We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review their privacy policies.</p>
              <li style={{ fontWeight: 'bold', marginTop: '8px' }}>Children's Privacy</li>
              <p style={{ textAlign: 'justify' }}>RavenXAI is not intended for use by individuals under the age of 13, and we do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately, and we will take appropriate action.</p>
              <li style={{ fontWeight: 'bold', marginTop: '8px' }}>Changes to This Privacy Policy</li>
              <p style={{ textAlign: 'justify' }}>We reserve the right to update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.</p>
              <li style={{ fontWeight: 'bold', marginTop: '8px' }}>Contact Us</li>
              If you have any questions or concerns about this privacy policy, please contact us at:
              <br />
              <strong>RavenXAI</strong> <br />
              <strong>Email:</strong> info@ravenxai.com <br />
              <strong>Address:</strong> Sydney, Australia
            </ol>

          </Grid>
        </Container>
      </Container>
    </Grid >
  );
}

export default PrivacyPolicy;
