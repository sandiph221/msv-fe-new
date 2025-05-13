import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: "0.375rem",
    height: "48px",
  },
  textarea: {
    backgroundColor: "#fff",
    borderRadius: "0.375rem",
    minHeight: "96px",
  },
  select: {
    height: "48px",
    backgroundColor: "#fff",
    borderRadius: "0.375rem",
  },
  button: {
    height: "48px",
    width: "100%",
    marginTop: theme.spacing(1),
    textTransform: "none",
    fontWeight: 500,
  },
}));

export const ContactForm = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    message: "",
    source: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <section className="py-14">
      <div className="">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex-1 space-y-4 lg:py-16">
            <p className="text-4xl font-medium leading-tight text-gray-800 sm:text-6xl">
              Let us know what you think!{" "}
            </p>
            <p className="text-sm text-gray-500">
              We're here to help and answer any question you might have, We look
              forward to hearing from you! Please fill out the form, or us the
              contact information bellow.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormControl className={classes.formControl}>
                <TextField
                  name="name"
                  placeholder="Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{
                    className: classes.input,
                  }}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  name="email"
                  type="email"
                  placeholder="Email"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    className: classes.input,
                  }}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  name="companyName"
                  placeholder="Company Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  InputProps={{
                    className: classes.input,
                  }}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  name="message"
                  placeholder="Enter Your Message"
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  InputProps={{
                    className: classes.textarea,
                  }}
                />
              </FormControl>

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="source-select-label">
                  How did you hear about us?
                </InputLabel>
                <Select
                  labelId="source-select-label"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  label="How did you hear about us?"
                  className={classes.select}
                >
                  <MenuItem value="facebook">Facebook</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="twitter">Twitter</MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                  <MenuItem value="friends">Friends</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Submit
              </Button>
            </form>
          </div>
          <div className="space-y-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.7566951117224!2d151.20438337626294!3d-33.870160719130176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae3f216d52b7%3A0xaa4742657bf6460b!2sGeorge%20St%2C%20Sydney%20NSW%2C%20Australia!5e0!3m2!1sen!2snp!4v1724690699449!5m2!1sen!2snp"
              className="h-full min-h-96 w-full rounded-2xl border-none"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
