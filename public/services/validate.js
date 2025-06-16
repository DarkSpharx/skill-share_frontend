export function validateRegisterForm(form) {
  const formData = new FormData(form);
  const errors = {};
  const username = formData.get("username");

  if (username !== null && !username.trim()) {
    errors.username = "Le nom de l'utilisateur est requis.";
  }

  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
  const emailRegex = new RegExp(
    `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
  );

  const email = formData.get("email").trim();
  if (!emailRegex.test(email)) {
    errors.email = "L'adresse e-mail n'est pas valide.";
  }
  // Regex mot de passe : 12 caractères minimum, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
  const passwordRegexPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]{12,}$/;
  const strongPasswordRegex = new RegExp(passwordRegexPattern);
  const password = formData.get("password").trim();
  if (!strongPasswordRegex.test(password)) {
    errors.password =
      "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
  }
  if (formData.get("avatar")) {
    const file = formData.get("avatar");
    let errorsAvatarTab = [];
    // avatar obligatoire
    //   if (!file.name) {
    //     errorsAvatarTab.push("L'avatar est requis.");
    //   }

    // avatar doit être une image PNG ou JPG
    if (file.name && !file.type.match(/^image\/(png|jpg|jpeg)$/)) {
      errorsAvatarTab.push("Le fichier doit être une image PNG ou JPG.");
    }
    // avatar doit faire moins de 2 Mo
    const maxSize = 2 * 1024 * 1024; // 2 Mo
    if (file.name && file.size > maxSize) {
      errorsAvatarTab.push("Le fichier ne doit pas dépasser 2 Mo.");
    }
    // tableau avatar doit faire moins de 2 Mo et faire partie des types autorisés
    if (errorsAvatarTab.length > 0) {
      errors.avatar = errorsAvatarTab.join("| ");
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
