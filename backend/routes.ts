import { Router, Request, Response } from 'express';
import cities from './cities.json';
import schools1 from './schools-1.json';
import schools2 from './schools-2.json';
import formStructure from './form.json';
import { getSchools } from './controllers/schoolController';
import { submitForm } from './controllers/submitController';
// import formStructure from './form-test.json';
const router = Router();


router.get('/cities', (req: Request, res: Response) => {
  res.json(cities);
});
router.get('/schools', getSchools);
router.get('/form', (req: Request, res: Response) => {
  res.json(formStructure);
});
router.post('/submit', submitForm);



export default router;
