// sanity/schema.js - Make sure to import and add these schemas
import travelPost from './schemas/documents/travelPost'
import travelDay from './schemas/objects/travelDay'
import travelActivity from './schemas/objects/travelActivity'

export const schema = {
  types: [
    // Add your existing types here
    travelPost,
    travelDay,
    travelActivity
  ],
}