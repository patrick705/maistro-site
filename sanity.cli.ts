import { defineCliConfig } from 'sanity/cli'

import { dataset, projectId } from './lib/sanity/env'

export default defineCliConfig({
  api: { projectId: projectId || undefined, dataset },
  deployment: {
    appId: 'xkffam856j81dv8eba8fw85a',
  },
})
