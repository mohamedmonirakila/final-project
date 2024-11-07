import React from "react";


const DentalChart = () => {
  return ( 
  <div>
        <h3 className="mt-5">Dental Chart</h3>
                  <div className="form-group">
                    <img
                      src="https://static.wixstatic.com/media/8960a6_0b36d919017d460c8c404389717bee70~mv2.png/v1/fill/w_980,h_467,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/8960a6_0b36d919017d460c8c404389717bee70~mv2.png"
                      useMap="#dentalmap"
                      className="img-fluid"
                      alt="Dental Chart"
                    />
                    <map name="dentalmap">
                      <area
                        shape="rect"
                        coords="50,8,100,220"
                        href="#"
                        className="tooth"
                        data-tooth="1"
                        title="Tooth 1"
                      />
                      <area
                        shape="rect"
                        coords="110,8,160,220"
                        href="#"
                        className="tooth"
                        data-tooth="2"
                        title="Tooth 2"
                      />
                      <area
                        shape="rect"
                        coords="170,8,220,220"
                        href="#"
                        className="tooth"
                        data-tooth="3"
                        title="Tooth 3"
                      />
                      <area
                        shape="rect"
                        coords="230,8,280,220"
                        href="#"
                        className="tooth"
                        data-tooth="4"
                        title="Tooth 4"
                      />
                      </map>
                      </div>
    </div>
    );
};
export default DentalChart;