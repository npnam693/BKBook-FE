import { GENRES } from '../../const/book';
import { UserState } from "./../../Context/UserProvider/index";
import { useState } from "react";
import StepOne from './StepOne';
import StepTwo from './StepTwo';
const dataSteps = ["Nhập thông tin sách", "Nhập thông tin vận chuyển", "Thanh toán phí đăng tin"];

function UploadPage() {
  const { userInfo } = UserState();
  const [step, setStep] = useState(0);
  const getStep = () => {
    switch (step) {
      case 0: return <StepOne setStep={setStep} />;
      case 1: return <StepTwo setStep={setStep} />;
      //case 2: return <StepThree setStep={setStep} />;
      default: return <></>
    }
  }

  return (
    <main className="w-layoutWith mx-auto">
      <section className="flex">
        {dataSteps.map((dataStep, index) => (
          <div key={index} className="flex items-center">
            <span className={`title-step relative flex font-bold text-lg items-center justify-center bg-gray-400 w-10 h-10 rounded-[100%] ${step === index && "bg-primary text-white shadow-2xl active"}`}>
              {index + 1}
            </span>
            <span className={`ml-3 mr-4 ${step === index ? "font-semibold" : ""}`}>{dataStep}</span>
            <div className={`h-[2px] bg-gray-400 w-10 mr-4 ${index === dataSteps.length - 1 && "hidden"} "`} />
          </div>
        ))}
      </section>

      <section className="w-full flex gap-x-10">
        {getStep(dataSteps)}

      </section>
    </main>
  );
}

export default UploadPage;
