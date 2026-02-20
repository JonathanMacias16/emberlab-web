export default function PilarCard({
  title,
  description,
  bg,
  textColor,
  position,
  className = "",
}: {
  title: string;
  description: string;
  bg: string;
  textColor: string;
  position: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute rounded-2xl md:rounded-3xl lg:rounded-[46px] flex flex-col justify-center border-4 lg:border-[6px] border-[#edeae7] shadow-[23px_20px_24px_-20px_rgba(0,0,0,0.48)] w-[41.4%] sm:w-[35.7%] md:w-[33.4%] lg:w-[32.9%] h-[48.3%] sm:h-[52.9%] md:h-[55.2%] lg:h-[57.2%] p-[3.5%] sm:p-[3.1%] lg:p-[2.9%] ${bg} ${position} ${className}`}
    >
      <h3
        className={`${textColor} text-xl sm:text-2xl md:text-3xl lg:text-[1.9rem] xl:text-[2.55rem] font-bold tracking-[-0.04em] leading-[1.1]`}
      >
        {title}
      </h3>
      <p
        className={`${textColor} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold tracking-[-0.04em] leading-[1.2] mt-4 lg:mt-[3.9rem]`}
      >
        {description}
      </p>
    </div>
  );
}
