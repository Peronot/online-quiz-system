import Swal from "sweetalert2";

const baseOptions = {
  confirmButtonColor: "#1E3A8A",
  heightAuto: false
};

export function showSuccess(title, text) {
  return Swal.fire({
    ...baseOptions,
    icon: "success",
    title,
    text
  });
}

export function showError(title, text) {
  return Swal.fire({
    ...baseOptions,
    icon: "error",
    title,
    text
  });
}

export function showWarning(title, text) {
  return Swal.fire({
    ...baseOptions,
    icon: "warning",
    title,
    text
  });
}

export function showConfirm({
  title,
  text,
  confirmText = "Yes",
  cancelText = "Cancel",
  confirmButtonColor = "#1E3A8A"
}) {
  return Swal.fire({
    ...baseOptions,
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor
  });
}

export function formatValidationErrors(errors) {
  if (!errors || typeof errors !== "object") return "";

  return Object.values(errors)
    .flat()
    .filter(Boolean)
    .join("\n");
}
