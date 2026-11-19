import logInImage from "../../assests/logInImage2.png";

function AuthSidePanel() {
  return (
    <div className="flex w-full overflow-hidden bg-blue-50 transition-all duration-300 ease-in-out lg:h-dvh">
      <div className="flex w-full flex-col gap-3 px-6 py-6 sm:px-10 md:px-14 lg:gap-4 lg:px-20 lg:py-8 xl:px-24">
        <h3 className="text-2xl font-bold text-slate-950 lg:text-3xl">
          Agency Portal
        </h3>

        <p className="text-xs font-medium text-primary lg:text-sm">
          DISTRIBUTION, CONNECTED
        </p>

        <h1 className="text-2xl font-bold leading-tight text-slate-900 transition-all duration-300 sm:text-3xl lg:text-4xl xl:text-5xl">
          <span className="block">Every delivery,</span>
          <span className="block">Handled with care.</span>
        </h1>

        <p className="max-w-xl text-sm font-medium text-slate-800 xl:text-base">
          Bring your stock, people and routes together. Keep your agency moving
          with confidence.
        </p>

        <div className="hidden h-56 items-center justify-center sm:flex md:h-72 lg:h-auto lg:min-h-0 lg:flex-1">
          <img
            src={logInImage}
            alt="Delivery truck"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="hidden flex-col gap-1 lg:flex">
          <p className="text-xl font-bold text-primary xl:text-2xl">
            Better coordination. Every day.
          </p>

          <p className="text-sm font-medium text-primary xl:text-base">
            Your people, stock and deliveries - working together.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthSidePanel;
