import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import audio from '@/store/modules/audio.js';
import login from '@/store/modules/LoginModule.js';

export default new Vuex.Store({
	modules:{
		audio,
		login
	}
})