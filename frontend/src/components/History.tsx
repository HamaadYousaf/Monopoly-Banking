import { Logs } from "../models/log";

interface HistoryProps {
    logs: Logs | null;
}

const History = ({ logs }: HistoryProps) => {
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center bg-white md:mt-10 mt-5 md:rounded-3xl rounded-xl mx-5 md:px-5 px-2">
                <div className="md:max-h-[35rem] max-h-96 overflow-auto ">
                    {logs?.map((log) => {
                        let view = <></>;

                        logs.indexOf(log) === 0
                            ? (view = (
                                  <div
                                      className="md:text-lg text-sm flex justify-between border-b-2 border-black pb-2 text-left"
                                      key={log.id}
                                  >
                                      <h1 className="md:pr-48 pr-14 pl-1">
                                          {log.message}
                                      </h1>
                                      <h2 className="pr-1 whitespace-nowrap">
                                          {log.time}
                                      </h2>
                                  </div>
                              ))
                            : (view = (
                                  <div
                                      className="md:text-lg text-sm flex justify-between border-b-2 border-black pb-2 mt-2 text-left"
                                      key={log.id}
                                  >
                                      <h1 className="md:pr-48 pr-14 pl-1">
                                          {log.message}
                                      </h1>
                                      <h2 className="pr-1 whitespace-nowrap">
                                          {log.time}
                                      </h2>
                                  </div>
                              ));

                        return view;
                    })}
                </div>
            </div>
        </>
    );
};

export default History;
