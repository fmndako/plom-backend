const ApplicationController = require('../../controller/users/applications');
const SuggestionController = require('../../controller/users/suggestions');
const express = require('express');

const router = express.Router();

router.get('/', ApplicationController.getApplications);

router.post('/', ApplicationController.createApplication);


router.get('/hasLiveApp', SuggestionController.hasLiveApp);

router.get('/:id', ApplicationController.getApplication);

router.put('/:id', ApplicationController.updateApplication);


router.get('/:id/subscriptions/reset', ApplicationController.resetSubscriptions);

router.get('/:id/subscriptions', ApplicationController.getApplicationSubscriptions);

router.post('/:id/requestLive', ApplicationController.requestLive);

router.post('/:id/confirmKeys', ApplicationController.confirmKeys);

router.post('/:id/:subscribe', ApplicationController.subscribe);

router.delete('/:id', ApplicationController.deleteApplication);

module.exports = router;
