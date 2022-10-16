export const setPatients = (state, patients) => {
  state.patients = patients;
}

export const changeLoading = (state, status) => {
  state.isLoading = status;
}
