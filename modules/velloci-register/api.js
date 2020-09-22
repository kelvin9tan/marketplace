import api from '~/api'

import { getSafe, generateQueryString } from '~/utils/functions'

export default {
  postRegisterVelloci: (body, files, documentType, companyId) => {
    //TODO append files
    const formData = new FormData()
    for (let i in files) {
      formData.append('files', files[i])
    }
    let queryParams = generateQueryString(companyId)
    api.post(`/prodex/api/payments/velloci/register${queryParams}`, body)
  },
  getEntityTypes: () => api.get('/prodex/api/payments/velloci/enums/entity-types').then(response => response.data),
  getNaicsCodes: () => api.get('/prodex/api/payments/velloci/enums/naics-codes').then(response => response.data),
  getBusinessRoles: () => api.get('/prodex/api/payments/velloci/enums/business-roles').then(response => response.data),
  getEntityDocuments: () =>
    api.get('/prodex/api/payments/velloci/enums/entity-documents').then(response => response.data),
  getPoliticallyExposedPersons: () =>
    api.get('/prodex/api/payments/velloci/enums/politically-exposed-persons').then(response => response.data),
  getTinTypes: () => api.get('/prodex/api/payments/velloci/enums/tin-types').then(response => response.data),
  getBusinessDetails: () => api.get('/prodex/api/payments/velloci/business-details').then(response => response.data)
}