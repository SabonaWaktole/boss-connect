/**
 * emailjs-form.js — Boss Capital
 *
 * Reusable EmailJS form handler.
 * Works on ANY page that has a form with id="contact-form"
 *
 * Usage — add these two lines before </body> on every page:
 *
 *   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
 *   <script src="emailjs-form.js"></script>
 *
 * From a subfolder (capabilities/ or gallery/):
 *
 *   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
 *   <script src="../emailjs-form.js"></script>
 */
(function () {
  "use strict";

  /* ─── CONFIG — update these values only ───────────────────── */
  var PUBLIC_KEY   = "2q6GTd3d0ZksRK_Nx";
  var SERVICE_ID   = "service_3fbiwny";
  var TEMPLATE_ID  = "template_0hesm4h";
  var TO_EMAIL     = "info@bossconnect.com.au";

  // PAGE_NAME
const page = window.location.pathname.split('/').pop().replace('.html', '');

  
  /* ─────────────────────────────────────────────────────────── */

  // Wait for the DOM to be ready
  function init() {
    // Initialise EmailJS
    emailjs.init(PUBLIC_KEY);

    // Find ALL forms with class="contact-form" on the page
    var forms = document.querySelectorAll(".contact-form");
    if (!forms.length) return;

    forms.forEach(function (form, index) {
      // Give each form a unique id if it doesn't already have one
      if (!form.id) form.id = "contact-form-" + index;

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Honeypot check — silently reject bots
        var honeypot = form.querySelector('[name="_gotcha"]');
        if (honeypot && honeypot.value) return;

        var btn  = form.querySelector('button[type="submit"]');
        var orig = btn.textContent;
        btn.disabled    = true;
        btn.textContent = "Sending\u2026";

        // Collect field values — works whether fields have id or just name
        function val(nameOrId) {
          var el = form.querySelector('[id="' + nameOrId + '"], [name="' + nameOrId + '"]');
          return el ? el.value : "";
        }

        emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          to_email : TO_EMAIL,
          PAGE_NAME: page,
          title    : "Boss Capital",
          NAME     : val("name"),
          EMAIL    : val("email"),
          PHONE    : val("phone"),
          MESSAGE  : val("message"),
        })
        .then(function () {
          // Success
          btn.textContent      = "Message Sent \u2713";
          btn.style.background = "#2d6a4f";
          btn.style.color      = "#fff";
          form.reset();

          // Reset button after 5 seconds
          setTimeout(function () {
            btn.disabled         = false;
            btn.textContent      = orig;
            btn.style.background = "";
            btn.style.color      = "";
          }, 5000);
        })
        .catch(function (err) {
          // Error
          console.error("EmailJS error:", err);
          btn.disabled    = false;
          btn.textContent = orig;
          alert("Something went wrong. Please call us on 0421 121 985.");
        });
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
