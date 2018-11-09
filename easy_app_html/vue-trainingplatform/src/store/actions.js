import * as type from './mutations-type'
import server from '../utils/axios'

export const init = async ({ commit }) => {
  const user = await server.get('/common/initPage')
  commit(type.INIT, {
    user: user.data.result
  })
}
