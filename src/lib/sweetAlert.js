
import Swal from "sweetalert2";

export const confirmAction = ({
  title,
  text,
  icon = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "#167d73",
}) =>
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#64748b",
    reverseButtons: true,
    focusCancel: true,
  });

export const showSuccess = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#167d73",
    confirmButtonText: "Done",
    timer: 2000,
    timerProgressBar: true,
  });

export const showError = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#167d73",
  });

export const showWarning = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonColor: "#167d73",
  });
