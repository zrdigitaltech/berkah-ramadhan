module.exports = {
  rules: {
    'next/no-img-element': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/no-danger-with-children': 'off',
    'immutable/no-mutation': 'error', // Mencegah mutasi state
    'redux/no-dispatch-in-reducer': 'error', // Mencegah dispatch dalam reducer
    'redux/no-mutable-state': 'error', // Mencegah state yang dapat diubah langsung
    'redux/no-assign-in-reducer': 'error' // Mencegah assignment langsung dalam reducer
  }
};
