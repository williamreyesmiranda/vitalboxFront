import { api } from 'boot/axios'

export const getAllPatients = async ({ commit }) => {
  const { data } = await api.get('patient/getAllPatients');
  commit('setPatients', data);
}

export const insertPatient = async ({ commit }, patient) => {
  const { data } = await api.post('patient/insertPatient', patient);
  return data;

}

export const deletePatient = async ({ commit }, idPatient) => {
  const { data } = await api.delete(`patient/deletePatient/${idPatient}`);
  return data;

}
export const updatePatient = async ({ commit }, { idPatient, user }) => {
  console.log(idPatient, user);
  const { data } = await api.put(`patient/updatePatient/${idPatient}`, user);
  return data;

}
