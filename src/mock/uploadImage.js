import Mock from 'mockjs'
import HttpData from './baseData'

const fetchImageInfoData = Mock.mock({
  id: '90ace6ac-a575-4920-89ec-db4ed970ac4a',
  file_path: '/home/lgp/data/vulcan/0/1633642383971/test_20211001_0000.ndpi',
  file_name: 'test_20211001_0000.ndpi',
  created: '2021-10-01T21:33:03.974285Z',
  creater: 0,
  updated: '2021-10-01T21:33:03.974301Z',
  file_MD5: 'MD5-ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  status: 0,
  next_index: 0,
  total_chunk: 3,
  platform: 'apollo'
})

const fetchImageInfo = (val) => {
  return new HttpData(fetchImageInfoData)
}
Mock.mock('vulcan/new_create/', 'post', fetchImageInfo)

const imageOne = Mock.mock({
  id: '90ace6ac-a575-4920-89ec-db4ed970ac4a',
  file_path: '/home/lgp/data/vulcan/0/1633642383971/test_20211001_0000.ndpi',
  file_name: 'test_20211001_0000.ndpi',
  created: '2021-10-01T21:33:03.974285Z',
  creater: 0,
  updated: '2021-10-02T21:33:03.974301Z',
  file_MD5: 'MD5-ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  status: 1,
  next_index: 1,
  total_chunk: 3,
  platform: 'apollo'
})
const imageTwo = Mock.mock({
  id: '90ace6ac-a575-4920-89ec-db4ed970ac4a',
  file_path: '/home/lgp/data/vulcan/0/1633642383971/test_20211001_0000.ndpi',
  file_name: 'test_20211001_0000.ndpi',
  created: '2021-10-01T21:33:03.974285Z',
  creater: 0,
  updated: '2021-10-02T21:33:03.974301Z',
  file_MD5: 'MD5-ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  status: 1,
  next_index: 2,
  total_chunk: 3,
  platform: 'apollo'
})
const imageThree = Mock.mock({
  id: '90ace6ac-a575-4920-89ec-db4ed970ac4a',
  file_path: '/home/lgp/data/vulcan/0/1633642383971/test_20211001_0000.ndpi',
  file_name: 'test_20211001_0000.ndpi',
  created: '2021-10-01T21:33:03.974285Z',
  creater: 0,
  updated: '2021-10-02T21:33:03.974301Z',
  file_MD5: 'MD5-ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  status: 2,
  next_index: 3,
  total_chunk: 3,
  platform: 'apollo'
})
const shardToUpload = (val) => {
  for (var value of val.body) {
    if (value[0] === 'current_index' && value[1] === '0') {
      return new HttpData(imageOne)
    } else if (value[0] === 'current_index' && value[1] === '1') {
      return new HttpData(imageTwo)
    } else {
      return new HttpData(imageThree)
    }
  }
}
Mock.mock(RegExp('vulcan/new_upload_part/' + '.*'), 'post', shardToUpload)

// 上传完成后通知后台
// Mock.mock('neptune/review/review_image/', 'post', new HttpData({}))
