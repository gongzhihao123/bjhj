import * as type from './mutations-type'
import server from '../utils/axios'

export const init = async ({ commit }, { url }) => {
  const user = await server.get('/common/initPage')
  const semesterList = await server.get('/common/selectSemesterList')
  const sectionList = await server.get('/common/selectSectionList')
  commit(type.INIT, {
    user: user.data.result,
    semesterList: semesterList.data.result,
    sectionList: sectionList.data.result,
    url
  })
}
