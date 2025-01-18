import express from 'express';
const router = express.Router();
import ContactoController from '../controllers/contactoController.js';

router.get('/', ContactoController.showForm);
router.post('/add', ContactoController.add);
router.get('/success', ContactoController.showSuccess);

export default router;
