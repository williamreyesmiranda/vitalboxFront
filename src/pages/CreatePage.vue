<template>
  <q-page class="">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <router-link :to="{name:'index'}" style="text-decoration: none;">
        <q-btn fab icon="home" color="accent" />
      </router-link>

    </q-page-sticky>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <h3>Registro de Pacientes </h3>
        <q-separator />

      </div>
      <div class="q-pa-md" style="max-width: 400px;">

        <q-form ref="focus" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input filled v-model.trim.lazy="form.name" label="Nombre del Paciente *" lazy-rules
            :rules="[ val => val && val.length > 0 || 'Por favor ingresa el nombre del paciente']" />

          <q-select v-model="form.typeDni" :options="options" label="Tipo Documento *"
            :rules="[ val => val && val.length > 0 || 'Por favor ingresa el tipo de documento']" />

          <q-input filled type="number" v-model="form.dni" label="Número de documento *" lazy-rules :rules="[
            val => val !== null && val !== '' || 'Por favo ingresa el numero del documento',
          ]" />

          <q-date v-model="form.dateBirth" subtitle="Fecha de Cumpleaños" :title="form.name"
            :rules="[ val => val !== null && val !== ''|| 'Ingresa la fecha de cumpleaños']" />

          <q-input filled type="number" v-model="form.weight" label="Peso (kg) *" lazy-rules :rules="[
            val => val !== null && val !== '' || 'Por favor inresa el peso del paciente',
            val => val > 0 && val < 400 || 'Por favor ingresa un peso real'
          ]" />

          <q-input filled type="number" v-model="form.height" label="Estatura (cms) *" lazy-rules :rules="[
            val => val !== null && val !== '' || 'Por favor ingresa la estatura del paciente',
            val => val > 0 && val < 250 || 'Por favor ingresa una estatura real'
          ]" />

          <div>
            <q-btn label="Ingresar Paciente" type="submit" color="primary" />
            <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>

      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import usePatient from 'src/composables/usePatient';

const options = [
  'CC', 'DI', 'CE'
]

export default defineComponent({
  name: 'CreatePage',
  setup() {
    const $q = useQuasar()
    const { insertPatient } = usePatient();
    const router = useRouter();
    const focus = ref()

    const form = ref({
      name: 'William Reyes',
      typeDni: 'CC',
      dni: '123456789',
      dateBirth: '1990/03/19',
      weight: '80',
      height: '175',
    })



    const onReset = () => {
      form.value.name = ''
      form.value.typeDni = ''
      form.value.dni = ''
      form.value.dateBirth = ''
      form.value.weight = ''
      form.value.height = ''
      focus.value.focus();

    }

    return {
      focus,
      form,
      options,
      onReset,
      onSubmit: async () => {
        if (form.value.dateBirth == '' || form.value.dateBirth == null) {
          return $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Por favor selecciona una fecha de nacimiento'
          })
        }
        form.value.dni = parseInt(form.value.dni)
        form.value.weight = parseInt(form.value.weight)
        form.value.height = parseInt(form.value.height)
        const resp = await insertPatient(form.value);

        if (resp) {
          $q.notify({
            color: 'success',
            icon: 'done',
            message: 'Paciente ingresaro correctamente'
          })
          onReset();

        } else {
          return $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Ocurrió un problema al registrar el paciente'
          })
        }




      },

    }

  }
})
</script>
