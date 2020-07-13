const blankPage = {
  state: {
    blankPagePrames: {}
  },
  mutations: {
    set_blank_page_prames: state => {}
  },
  actions: {
    openBlankPage({ commit }, prames) {
      commit('set_blank_page_prames');
    }
  }
};

export default blankPage;
