import { fetchData } from "../../lib/fetchData.js";
import { validateRegisterForm } from "../../services/validate.js";

document.addEventListener("DOMContentLoaded", () => {
  //redirection si déja connecté
  const registerForm = document.querySelector("#register-form");
  const API_URL = document.querySelector("#api-url").value;
  const msg = document.querySelector("#verify-msg");
  console.log(API_URL);
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // réinitialisation des champs erreurs à vide
    registerForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));
    registerForm
      .querySelectorAll(".input")
      .forEach((input) => input.classList.remove("error-input"));
    // validation des données
    const { valid, errors } = validateRegisterForm(registerForm);

    if (!valid) {
      // si les données ne sont pas valides, on affiche les erreurs
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = registerForm.querySelector(`[data-error="${field}"]`);
        if (errorSpan) {
          errorSpan.textContent = message;
          errorSpan.classList.add("error");
        }
        const input = registerForm.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }
    // recupération des saisies via les attributes "name" => clé:valeur
    const formData = new FormData(registerForm);

    const jsonData = {};
    formData.forEach((value, key) => {
      if (key !== "avatar") {
        jsonData[key] = value;
      }
    });

    // si l'avatar est présent, on crée un FormData
    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile.size > 0) {
      const avatarFileData = new FormData();
      avatarFileData.append("avatar", avatarFile);

      try {
        const result = await fetchData({
          route: "/api/upload-avatar",
          api: API_URL,
          options: {
            method: "POST",
            body: avatarFileData,
          },
        });
        jsonData.avatar = result.filename; // on ajoute le nom du fichier à jsonData
      } catch (error) {
        // messsage utilisateur
      }
    }

    try {
      const result = await fetchData({
        route: "/api/register",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(jsonData),
        },
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      if (result.success) {
        registerForm.reset(); // réinitialisation du formulaire
        msg.textContent =
          "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.";
        msg.style.color = "red";
        msg.style.textAlign = "center";
      }
    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "red";
      msg.style.textAlign = "center";
    }
  });

  const fileContainer = document.getElementById("fileContainer");
  const fileInput = document.getElementById("avatar");

  if (fileContainer && fileInput) {
    fileContainer.addEventListener("click", (e) => {
      // Empêche le clic sur l'input de relancer le clic (boucle)
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });
  }

  const filePreview = document.getElementById("filePreview");
  const preview = document.getElementById("preview");
  const fileInfo = document.getElementById("fileInfo");
  const errorSpan = document.querySelector('[data-error="avatar"]');

  // Drag and drop functionality
  fileContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileContainer.classList.add("drag-over");
  });

  fileContainer.addEventListener("dragleave", (e) => {
    e.preventDefault();
    fileContainer.classList.remove("drag-over");
  });

  fileContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    fileContainer.classList.remove("drag-over");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFileSelect(files[0]);
    }
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });

  function handleFileSelect(file) {
    // Clear previous error
    errorSpan.textContent = "";
    fileContainer.classList.remove("error");

    // Validate file
    const errors = validateFile(file);
    if (errors.length > 0) {
      errorSpan.textContent = errors.join(" ");
      fileContainer.classList.add("error");
      fileContainer.classList.remove("has-file");
      filePreview.classList.remove("show");
      return;
    }

    // Show file preview
    fileContainer.classList.add("has-file", "upload-success");
    setTimeout(() => fileContainer.classList.remove("upload-success"), 500);

    // Display file info
    const fileSize = (file.size / 1024).toFixed(1);
    fileInfo.textContent = `${file.name} (${fileSize} KB)`;

    // Show image preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        filePreview.classList.add("show");
      };
      reader.readAsDataURL(file);
    }
  }

  function validateFile(file) {
    const errors = [];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!file.type.match(/image\/(png|jpg|jpeg)$/)) {
      errors.push("Avatar must be an image file (PNG, JPG, JPEG).");
    }

    if (file.size > maxSize) {
      errors.push(`Avatar must be less than 2MB.`);
    }

    return errors;
  }

  // Simulate form validation for demo
  setTimeout(() => {
    // Uncomment to test error state
    // errorSpan.textContent = 'File too large';
    // fileContainer.classList.add('error');
  }, 100);
});
