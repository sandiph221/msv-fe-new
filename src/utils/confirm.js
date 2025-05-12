
export function deleteConfirmation(title, description,) {
    const Swal = window.swal
    return Swal.fire({
        title: title,
        text: description,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "No",
        denyButtonText: `Yes`
    })
    .then((result) => result.isDenied);
}