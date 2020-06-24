const s2clientprotocol = require('s2clientprotocol')
const dir = require('path')
const np = require(dir.resolve(__dirname, './numpy.js'))
const image_differencer = require(dir.resolve(__dirname, 'image_differencer.js'))
const proto_diff = require(dir.resolve(__dirname, 'proto_diff.js'))
const { common_pb, sc2api_pb, spatial_pb } = s2clientprotocol
const sc_pb = sc2api_pb

describe('image_differencer.js', () => {
  describe('  ImageDifferencerTest', () => {
    test('testFilteredOut', () => {
      const path = new proto_diff.ProtoPath(['observation', 'actions', 1])
      const result = image_differencer.image_differencer(path, null, null)
      expect(result).not.toBeNull()
    })

    test('testFilteredIn', () => {
      const a = new sc_pb.ResponseObservation()
      const observation = new sc_pb.Observation()
      const feature_layer_data_a = new spatial_pb.ObservationFeatureLayer()
      const renders_a = new spatial_pb.FeatureLayers()
      const height_map_a = new common_pb.ImageData()
      height_map_a.setBitsPerPixel(32)
      height_map_a.setSize(common_pb.Size2DI(4, 4))
      const data_a = new Uint8Array(1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1)
      height_map_a.setData(data_a)
      renders_a.setHeightMap(height_map_a)
      feature_layer_data_a.setRenders(height_map_a)
      observation.setFeatureLayerData(renders_a)
      a.setObservation(observation)

      const b = new sc_pb.ResponseObservation()
      const observation_b = new sc_pb.Observation()
      const feature_layer_data_b = new spatial_pb.ObservationFeatureLayer()
      const renders_b = new spatial_pb.FeatureLayers()
      const height_map_b = new common_pb.ImageData()
      height_map_b.setBitsPerPixel(32)
      height_map_b.setSize(common_pb.Size2DI(4, 4))
      const data_b = new Uint8Array(0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0)
      height_map_b.setData(data_b)
      renders_b.setHeightMap(height_map_b)
      feature_layer_data_b.setRenders(height_map_b)
      observation_b.setFeatureLayerData(renders_b)
      b.setObservation(observation_b)

      const path = new proto_diff.ProtoPath(['observation', 'feature', 'renders', 'height_map', 'data'])
      const result = image_differencer.image_differencer(path, a, b)
      expect(result).toBe('3 element(s) changed - [1][0]: 1 -> 0; [1][1]: 0 -> 1; [3][3]: 1 -> 0')
    })
  })
})
