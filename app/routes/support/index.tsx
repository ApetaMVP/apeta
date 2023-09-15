export default function SupportPage() {
  return (
    <body
      style={{
        fontFamily: "sans-serif",
      }}
    >
      <h1>Support</h1>
      <p>
        Welcome to the support page for <strong>Apeta</strong>! If you have any
        questions or need assistance, you've come to the right place.
      </p>

      <h2>Contact Information</h2>
      <p>
        If you need help or have any inquiries, you can reach out to our support
        team at the following email address:{" "}
        <a href="mailto:help@apeta.dev">help@apeta.dev</a>
      </p>

      <h2>Contact Form</h2>
      <p>
        If you prefer, you can also use the contact form below to submit your
        inquiry. Please provide your name, email address, and a detailed
        description of your question or concern. We'll get back to you as soon
        as possible.
      </p>

      {/* <form action="[submit form URL]" method="post">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name"><br>
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email"><br>
        <label for="message">Message:</label><br>
        <textarea id="message" name="message" rows="4" cols="50"></textarea><br><br>
        <input type="submit" value="Submit">
    </form> */}

      <h2>Social Media</h2>
      <p>
        Stay connected with us on social media for updates, announcements, and
        more:
      </p>
      <ul>
        <li>
          <a href="https://instagram.com/apetallc?igshid=MzMyNGUyNmU2YQ==">
            Instagram
          </a>
        </li>
      </ul>

      <h2>We're Here to Help!</h2>
      <p>
        We are dedicated to assisting you. Don't hesitate to get in touch if you
        encounter any issues or have any questions about using{" "}
        <strong>Apeta</strong>. We're here to make your experience as smooth as
        possible.
      </p>
    </body>
  );
}
