import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event"
import JobApi from "../../../../app/api/job/Job.api";
import JobsModalComponent from "./JobsModal.component";


const mockJob: Job = {
    description: "description",
    id: 1,
    title: "title",
    salary: "salary",
    status: false
}

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: any) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    })
  });

jest.mock('../../../../app/api/job/Job.api', () => ({
    getById: jest.fn(() => mockJob),
    create: jest.fn(()=> {}),
    update: jest.fn(()=> {}),
    getAllShort: jest.fn(()=> {}),
  }));


// needs act warning fix
describe('JobsModal test', () => {
    it('should be rendered', ()=>{
        const open = true;
        const setOpen = () => {};
        const currentId = 1;

        render(<JobsModalComponent open={open} setOpen={setOpen} currentId={currentId} />)
        // test input in title field
        const inputTitle = screen.getByRole('textbox', {
            name: /назва вакансії/i
          })
         user.click(inputTitle)
         user.keyboard('test')
        // idk how to compare properly
        expect(inputTitle).toBe('test');
    })

    it('should call the mock function', () => {
        JobApi.getById(8);
        expect(JobApi.getById).toHaveBeenCalled();
    
      });
})
