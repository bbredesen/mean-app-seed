import mongoose from 'mongoose';

import config from './config';
import log from './logging';

mongoose.connect(config.database.connectUri, { useNewUrlParser: true })
  .then( () => log.info(`Connection to ${config.database.connectUri} established`) )
  .catch( err => {
    // If MongoDB is not available, there isn't much we can do. Report the error and exit.
    log.error(`Connection to ${config.database.connectUri} failed, exiting. (%o)`, err);
    process.exit(1);
  });

export default mongoose.connection;
