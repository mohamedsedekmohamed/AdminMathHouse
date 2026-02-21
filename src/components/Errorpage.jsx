import React from 'react';
import styled from 'styled-components';

const Errorpage = () => {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center  bg-black text-white'>
      <StyledWrapper>
        <div className="loader">
          <div className="ring outer">
            <div className="item item-1"><span className="symbol">∫</span></div>
            <div className="item item-2"><span className="symbol">∑</span></div>
            <div className="item item-3"><span className="symbol">∂</span></div>
          </div>
          <div className="ring middle">
            <div className="item item-1"><span className="symbol">π</span></div>
            <div className="item item-2"><span className="symbol">e</span></div>
          </div>
          <div className="ring inner">
            <div className="item item-1"><span className="symbol">∞</span></div>
            <div className="item item-2"><span className="symbol">√</span></div>
          </div>
          <div className="core" />
        </div>
      </StyledWrapper>

      {/* Error Message */}
    {/* Error Message */}
<div className="text-center mt-6">
  <h1 className="text-2xl font-bold text-red-600">
    API Request Failed
  </h1>

  <p className="mt-2 text-gray-400">
    Something went wrong while fetching data. Please try again.
  </p>

  {/* Refresh Button */}
  <button
    onClick={() => window.location.reload()}
    className="mt-6 px-6 py-2 rounded-lg border border-[#7D0A0A] 
               bg-[#7D0A0A] hover:bg-transparent 
               text-white hover:text-[#7D0A0A] 
               transition-all duration-300"
  >
    Refresh Page
  </button>
</div>

    </div>
  );
};

const StyledWrapper = styled.div`
  :root {
    --color-one: #7D0A0A;
  }

  .loader {
    position: relative;
    width: 150px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.1),
      0 0 20px rgba(0, 0, 0, 1);
  }

  .ring {
    position: absolute;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: spin 10s linear infinite;
  }

  .outer {
    width: 140px;
    height: 140px;
    border: 2px solid var(--color-one);
    box-shadow: 0 0 15px var(--color-one);
  }

  .middle {
    width: 100px;
    height: 100px;
    border: 2px dashed var(--color-one);
    box-shadow: 0 0 10px var(--color-one);
    animation-direction: reverse;
  }

  .inner {
    width: 60px;
    height: 60px;
    border: 2px solid var(--color-one);
    box-shadow: 0 0 8px var(--color-one);
  }

  .symbol {
    color: #fff;
    text-shadow: 0 0 8px var(--color-one);
  }

  .item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
  }

  .outer .item-1 { transform: rotate(0deg) translate(0, -70px); }
  .outer .item-2 { transform: rotate(120deg) translate(0, -70px); }
  .outer .item-3 { transform: rotate(240deg) translate(0, -70px); }

  .middle .item-1 { transform: rotate(0deg) translate(0, -50px); }
  .middle .item-2 { transform: rotate(180deg) translate(0, -50px); }

  .inner .item-1 { transform: rotate(90deg) translate(0, -30px); }
  .inner .item-2 { transform: rotate(270deg) translate(0, -30px); }

  .core {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--color-one);
    border-radius: 50%;
    box-shadow:
      0 0 10px var(--color-one),
      0 0 25px var(--color-one);
    animation: pulse 2s infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.4); opacity: 1; }
    100% { transform: scale(1); opacity: 0.7; }
  }
`;

export default Errorpage;
