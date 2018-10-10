import axios from 'axios';

const api = {
    fetchNewUsers: () => axios.get('/api/oprw95/users/').then(response => response.data.data.users),
    promoteToMerchant: (payload) => axios.put('/api/ca8cjf/users/' + payload.id, {...payload.user}),
    promoteToOperator: (payload) => axios.put('/api/nc5xyn/users/' + payload.id, {...payload.user}),
    fetchOperators: () => axios.get('/api/e04gpb/operators/').then(response => response.data.data.origins),
    removeOperator: (id) => axios.delete('/api/j94weq/operators/' + id),
    editOperator: (operator) => axios.put('/api/fcn0ij/operators/' + operator.id, {...operator}),
};

export default api;