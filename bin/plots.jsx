import React, { useState, useEffect } from 'react';

// Sample data based on the paper reproduction
const confusionMatrixData = {
  truePositive: {
    count: 4315,
    examples: [
      'nigga in a hostile context',
      'bitch used aggressively',
      'retard as insult',
    ],
  },
  falsePositive: {
    count: 1606,
    examples: [
      'scarecrow in neutral context',
      'pearl-clutcher in discussion',
      'blackfellow in Australian context',
    ],
  },
  falseNegative: {
    count: 1416,
    examples: [
      'fuckup describing person',
      'simp used derogatorily',
      'peeler with racial connotations',
    ],
  },
  trueNegative: {
    count: 4172,
    examples: [
      'black describing color',
      'queer in LGBTQ+ discussion',
      'cry describing emotion',
    ],
  },
};

const errorProneTerms = [
  {
    term: 'black',
    errorRate: 0.41,
    examples: ['racial context vs. color context'],
  },
  {
    term: 'queer',
    errorRate: 0.38,
    examples: ['reclaimed usage vs. slur usage'],
  },
  {
    term: 'monkey',
    errorRate: 0.35,
    examples: ['animal reference vs. racial slur'],
  },
  {
    term: 'bitch',
    errorRate: 0.32,
    examples: ['female dog vs. derogatory term'],
  },
  {
    term: 'retard',
    errorRate: 0.29,
    examples: ['technical term vs. ableist slur'],
  },
  {
    term: 'redneck',
    errorRate: 0.27,
    examples: ['self-identification vs. insult'],
  },
  {
    term: 'girl',
    errorRate: 0.25,
    examples: ['age descriptor vs. diminutive usage'],
  },
  {
    term: 'ghetto',
    errorRate: 0.23,
    examples: ['location descriptor vs. stereotyping'],
  },
  { term: 'cracker', errorRate: 0.22, examples: ['food item vs. racial term'] },
  {
    term: 'simp',
    errorRate: 0.2,
    examples: ['internet slang with varying intensity'],
  },
];

const dinuTerms = [
  {
    term: 'retarded',
    accuracy: 0.94,
    examples: ['medical context', 'used as insult'],
  },
  {
    term: 'teabagger',
    accuracy: 0.85,
    examples: ['political context', 'gaming slang'],
  },
  {
    term: 'redneck',
    accuracy: 0.83,
    examples: ['self-identification', 'used pejoratively'],
  },
  {
    term: 'dumb',
    accuracy: 0.75,
    examples: ['unable to speak', 'insulting intelligence'],
  },
  {
    term: 'monkey',
    accuracy: 0.72,
    examples: ['animal reference', 'racial connotation'],
  },
  {
    term: 'queer',
    accuracy: 0.71,
    examples: ['LGBTQ+ identity', 'used as slur'],
  },
  {
    term: 'joke',
    accuracy: 0.57,
    examples: ['humor reference', 'dismissive usage'],
  },
  {
    term: 'black',
    accuracy: 0.5,
    examples: ['color reference', 'racial reference'],
  },
  {
    term: 'specialize',
    accuracy: 0.44,
    examples: ['expertise context', 'euphemistic usage'],
  },
  {
    term: 'bag bitch',
    accuracy: 0.0,
    examples: ['complete tokenization failure'],
  },
];

// ConfusionMatrix Component
const ConfusionMatrix = ({ selectedQuadrant }) => {
  return (
    <div className='flex flex-col items-center space-y-4'>
      <h3 className='text-xl font-bold'>HateWiC Classification Results</h3>
      <p className='text-sm text-gray-600 mb-2'>
        Quadrant examples auto-displayed
      </p>

      <div className='grid grid-cols-2 gap-1'>
        {Object.entries(confusionMatrixData).map(([key, data]) => (
          <div
            key={key}
            className={`p-4 text-center border ${selectedQuadrant === key
                ? 'ring-2 ring-blue-500 bg-yellow-100'
                : 'bg-gray-100'
              }`}
          >
            <div className='font-bold capitalize'>
              {key.replace(/([A-Z])/g, ' $1')}
            </div>
            <div className='text-lg font-bold'>{data.count}</div>
          </div>
        ))}
      </div>

      {selectedQuadrant && (
        <div className='mt-2 p-3 bg-gray-100 rounded-md w-full'>
          <div className='font-bold mb-1'>Example Cases:</div>
          <ul className='list-disc pl-5 text-sm'>
            {confusionMatrixData[selectedQuadrant].examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ErrorProneTerms Component
const ErrorProneTerms = ({ selectedTerm }) => {
  return (
    <div className='flex flex-col items-center'>
      <h3 className='text-xl font-bold mb-2'>Top 10 Error-Prone Terms</h3>
      <div className='w-full'>
        {errorProneTerms.map((item, index) => (
          <div key={index} className='mb-2'>
            <div className='flex items-center'>
              <div className='w-24 text-right pr-2 font-medium'>
                {item.term}
              </div>
              <div
                className={`h-6 ${selectedTerm === index ? 'bg-blue-600' : 'bg-blue-300'
                  } transition-all rounded-sm`}
                style={{ width: `${item.errorRate * 100 * 6}px` }}
              ></div>
              <div className='ml-2 text-sm'>
                {(item.errorRate * 100).toFixed(0)}%
              </div>
            </div>

            {selectedTerm === index && (
              <div className='ml-24 mt-1 p-2 bg-gray-100 rounded-md text-sm'>
                <span className='font-medium'>Context:</span> {item.examples}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// DINUResults Component
const DINUResults = ({ hoveredTerm }) => {
  return (
    <div className='flex flex-col items-center'>
      <h3 className='text-xl font-bold mb-2'>DINU Pejorative Usage Results</h3>

      <div className='w-full'>
        {dinuTerms.map((item, index) => (
          <div key={index} className='p-1 text-sm border-b'>
            <div
              className={`grid grid-cols-5 gap-1 ${hoveredTerm === index ? 'bg-gray-200' : ''
                }`}
            >
              <div className='col-span-2 font-medium'>{item.term}</div>
              <div className='col-span-1 text-center'>
                {item.accuracy.toFixed(2)}
              </div>
              <div className='col-span-2 flex items-center'>
                <div
                  className={`h-4 rounded-sm ${item.accuracy > 0.7
                      ? 'bg-green-500'
                      : item.accuracy > 0.5
                        ? 'bg-yellow-500'
                        : item.accuracy > 0
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                    }`}
                  style={{ width: `${item.accuracy * 100 * 2 + 0.5}px` }}
                ></div>
              </div>
            </div>

            {hoveredTerm === index && (
              <div className='col-span-5 p-2 bg-gray-100 rounded-md mt-1'>
                <div className='text-xs'>
                  <span className='font-medium'>Examples:</span>{' '}
                  {item.examples.join(', ')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Interactive Confusion Matrix Component
// const ConfusionMatrix = () => {
//   const [selectedQuadrant, setSelectedQuadrant] = useState(null);

//   return (
//     <div className='flex flex-col items-center space-y-4'>
//       <h3 className='text-xl font-bold'>HateWiC Classification Results</h3>
//       <p className='text-sm text-gray-600 mb-2'>
//         Click on quadrants to see examples
//       </p>

//       <div className='grid grid-cols-2 gap-1'>
//         <div
//           className={`bg-green-100 hover:bg-green-200 p-4 text-center border cursor-pointer ${
//             selectedQuadrant === 'tp' ? 'ring-2 ring-blue-500' : ''
//           }`}
//           onClick={() => setSelectedQuadrant('tp')}
//         >
//           <div className='font-bold'>True Positive</div>
//           <div className='text-lg font-bold'>
//             {confusionMatrixData.truePositive.count}
//           </div>
//           <div className='text-xs'>Correctly Identified as Hateful</div>
//         </div>

//         <div
//           className={`bg-red-100 hover:bg-red-200 p-4 text-center border cursor-pointer ${
//             selectedQuadrant === 'fp' ? 'ring-2 ring-blue-500' : ''
//           }`}
//           onClick={() => setSelectedQuadrant('fp')}
//         >
//           <div className='font-bold'>False Positive</div>
//           <div className='text-lg font-bold'>
//             {confusionMatrixData.falsePositive.count}
//           </div>
//           <div className='text-xs'>Incorrectly Labeled as Hateful</div>
//         </div>

//         <div
//           className={`bg-red-100 hover:bg-red-200 p-4 text-center border cursor-pointer ${
//             selectedQuadrant === 'fn' ? 'ring-2 ring-blue-500' : ''
//           }`}
//           onClick={() => setSelectedQuadrant('fn')}
//         >
//           <div className='font-bold'>False Negative</div>
//           <div className='text-lg font-bold'>
//             {confusionMatrixData.falseNegative.count}
//           </div>
//           <div className='text-xs'>Missed Hateful Content</div>
//         </div>

//         <div
//           className={`bg-green-100 hover:bg-green-200 p-4 text-center border cursor-pointer ${
//             selectedQuadrant === 'tn' ? 'ring-2 ring-blue-500' : ''
//           }`}
//           onClick={() => setSelectedQuadrant('tn')}
//         >
//           <div className='font-bold'>True Negative</div>
//           <div className='text-lg font-bold'>
//             {confusionMatrixData.trueNegative.count}
//           </div>
//           <div className='text-xs'>Correctly Identified as Not Hateful</div>
//         </div>
//       </div>

//       {selectedQuadrant && (
//         <div className='mt-2 p-3 bg-gray-100 rounded-md w-full'>
//           <div className='font-bold mb-1'>Example Cases:</div>
//           <ul className='list-disc pl-5 text-sm'>
//             {selectedQuadrant === 'tp' &&
//               confusionMatrixData.truePositive.examples.map((ex, i) => (
//                 <li key={i}>{ex}</li>
//               ))}
//             {selectedQuadrant === 'fp' &&
//               confusionMatrixData.falsePositive.examples.map((ex, i) => (
//                 <li key={i}>{ex}</li>
//               ))}
//             {selectedQuadrant === 'fn' &&
//               confusionMatrixData.falseNegative.examples.map((ex, i) => (
//                 <li key={i}>{ex}</li>
//               ))}
//             {selectedQuadrant === 'tn' &&
//               confusionMatrixData.trueNegative.examples.map((ex, i) => (
//                 <li key={i}>{ex}</li>
//               ))}
//           </ul>
//         </div>
//       )}

//       <div className='text-sm text-center mt-2'>
//         <div>Accuracy: 73.7% | Macro F1: 0.74</div>
//         <div className='text-xs text-gray-600'>(vs. Paper's Reported ~74%)</div>
//       </div>
//     </div>
//   );
// };

// Error-Prone Terms Bar Chart
// const ErrorProneTerms = () => {
//   const [selectedTerm, setSelectedTerm] = useState(null);

//   return (
//     <div className='flex flex-col items-center'>
//       <h3 className='text-xl font-bold mb-2'>Top 10 Error-Prone Terms</h3>
//       <p className='text-sm text-gray-600 mb-4'>
//         Click on bars to see examples
//       </p>

//       <div className='w-full'>
//         {errorProneTerms.map((item, index) => (
//           <div key={index} className='mb-2'>
//             <div className='flex items-center'>
//               <div className='w-24 text-right pr-2 font-medium'>
//                 {item.term}
//               </div>
//               <div
//                 className={`h-6 ${
//                   selectedTerm === index ? 'bg-blue-500' : 'bg-blue-400'
//                 } hover:bg-blue-500 cursor-pointer transition-all rounded-sm`}
//                 style={{ width: `${item.errorRate * 100 * 6}px` }}
//                 onClick={() =>
//                   setSelectedTerm(index === selectedTerm ? null : index)
//                 }
//               ></div>
//               <div className='ml-2 text-sm'>
//                 {(item.errorRate * 100).toFixed(0)}%
//               </div>
//             </div>

//             {selectedTerm === index && (
//               <div className='ml-24 mt-1 p-2 bg-gray-100 rounded-md text-sm'>
//                 <span className='font-medium'>Context complexity:</span>{' '}
//                 {item.examples}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className='text-sm text-center mt-4 text-gray-600'>
//         Terms with high context-dependence show higher error rates
//       </div>
//     </div>
//   );
// };

// DINU Results Component
// const DINUResults = () => {
//   const [hoveredTerm, setHoveredTerm] = useState(null);

//   return (
//     <div className='flex flex-col items-center'>
//       <h3 className='text-xl font-bold mb-1'>DINU Pejorative Usage Results</h3>
//       <div className='flex justify-between w-full mb-4'>
//         <div className='text-center'>
//           <div className='font-bold'>DINU1</div>
//           <div>70.3% Accuracy</div>
//           <div className='text-xs text-gray-600'>(vs. 74.5% Original)</div>
//         </div>
//         <div className='text-center'>
//           <div className='font-bold'>DINU2</div>
//           <div>69.9% Accuracy</div>
//           <div className='text-xs text-gray-600'>(vs. 72.1% Original)</div>
//         </div>
//       </div>

//       <div className='w-full'>
//         <div className='grid grid-cols-5 gap-1 bg-gray-200 p-1 font-medium text-sm'>
//           <div className='col-span-2'>Term</div>
//           <div className='col-span-1 text-center'>Accuracy</div>
//           <div className='col-span-2 text-center'>Performance</div>
//         </div>

//         {dinuTerms.map((item, index) => (
//           <div
//             key={index}
//             className='grid grid-cols-5 gap-1 p-1 text-sm border-b hover:bg-gray-50 cursor-pointer'
//             onMouseEnter={() => setHoveredTerm(index)}
//             onMouseLeave={() => setHoveredTerm(null)}
//           >
//             <div className='col-span-2 font-medium'>{item.term}</div>
//             <div className='col-span-1 text-center'>
//               {item.accuracy.toFixed(2)}
//             </div>
//             <div className='col-span-2 flex items-center'>
//               <div
//                 className={`h-4 rounded-sm ${
//                   item.accuracy > 0.7
//                     ? 'bg-green-500'
//                     : item.accuracy > 0.5
//                     ? 'bg-yellow-500'
//                     : item.accuracy <= 0.5 && item.accuracy > 0
//                     ? 'bg-red-500'
//                     : 'bg-gray-300'
//                 }`}
//                 style={{ width: `${item.accuracy * 100 * 2 + 0.5}px` }}
//               ></div>
//             </div>

//             {hoveredTerm === index && (
//               <div className='col-span-5 p-2 bg-gray-100 rounded-md mt-1'>
//                 <div className='text-xs'>
//                   <span className='font-medium'>Example contexts:</span>{' '}
//                   {item.examples.join(', ')}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className='text-sm text-center mt-4 text-gray-600'>
//         Tokenization challenges affected multi-word terms most severely
//       </div>
//     </div>
//   );
// };

// Summary slide with key takeaways
const SummarySlide = () => {
  return (
    <div className='flex flex-col items-center'>
      <h3 className='text-xl font-bold mb-4'>Reproducibility Summary</h3>

      <div className='grid grid-cols-2 gap-4 w-full'>
        <div className='bg-green-50 p-4 rounded-md'>
          <h4 className='font-bold mb-2'>What Worked Well</h4>
          <ul className='list-disc pl-5 text-sm space-y-1'>
            <li>Clear, modular codebase structure</li>
            <li>Well-documented evaluation pipeline</li>
            <li>Standard ML libraries with minimal dependencies</li>
            <li>Core HateWiC task reproduced closely (73.7%)</li>
          </ul>
        </div>

        <div className='bg-red-50 p-4 rounded-md'>
          <h4 className='font-bold mb-2'>Challenges Faced</h4>
          <ul className='list-disc pl-5 text-sm space-y-1'>
            <li>Token alignment failures for multi-word terms</li>
            <li>Resource-intensive embedding generation</li>
            <li>Some preprocessing steps required clarification</li>
            <li>Performance drops in DINU tasks (2-4%)</li>
          </ul>
        </div>
      </div>

      <div className='mt-4 p-4 bg-blue-50 rounded-md w-full'>
        <h4 className='font-bold mb-2'>Key Findings</h4>
        <ul className='list-disc pl-5 text-sm space-y-1'>
          <li>HateBERT effectively captures contextual hatefulness</li>
          <li>Performance robustly reproduced within 2-4% margin</li>
          <li>Token alignment strategies critical for multi-word terms</li>
          <li>
            Further improvement possible with combined embeddings (WiC+Def)
          </li>
        </ul>
      </div>
    </div>
  );
};

// Main component that combines all slides
// const PresentationSlides = () => {
//   const [currentSlide, setCurrentSlide] = useState(1);

//   const renderSlide = () => {
//     switch (currentSlide) {
//       case 1:
//         return <ConfusionMatrix />;
//       case 2:
//         return <ErrorProneTerms />;
//       case 3:
//         return <DINUResults />;
//       case 4:
//         return <SummarySlide />;
//       default:
//         return <ConfusionMatrix />;
//     }
//   };

//   return (
//     <div className='flex flex-col items-center p-4 max-w-3xl mx-auto'>
//       <div className='w-full bg-white rounded-lg shadow-md p-6 mb-4'>
//         {renderSlide()}
//       </div>

//       <div className='flex space-x-2'>
//         <button
//           className={`px-3 py-1 rounded ${
//             currentSlide === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//           onClick={() => setCurrentSlide(1)}
//         >
//           Confusion Matrix
//         </button>
//         <button
//           className={`px-3 py-1 rounded ${
//             currentSlide === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//           onClick={() => setCurrentSlide(2)}
//         >
//           Error Analysis
//         </button>
//         <button
//           className={`px-3 py-1 rounded ${
//             currentSlide === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//           onClick={() => setCurrentSlide(3)}
//         >
//           DINU Results
//         </button>
//         <button
//           className={`px-3 py-1 rounded ${
//             currentSlide === 4 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//           onClick={() => setCurrentSlide(4)}
//         >
//           Summary
//         </button>
//       </div>

//       <div className='mt-4 text-sm text-gray-600'>
//         These interactive components can be incorporated into your PowerPoint
//         presentation
//       </div>
//     </div>
//   );
// };

// export default PresentationSlides;

// const PresentationSlides = () => {
//   const [currentSlide, setCurrentSlide] = useState(1);
//   const [selectedQuadrant, setSelectedQuadrant] = useState(null);
//   const [selectedTerm, setSelectedTerm] = useState(null);
//   const [hoveredTerm, setHoveredTerm] = useState(null);

//   useEffect(() => {
//     let slide = 1;
//     let quadrantIndex = 0;
//     let termIndex = 0;
//     let dinuIndex = 0;

//     const slides = [1, 2, 3, 4];
//     const quadrants = ['tp', 'fp', 'fn', 'tn'];

//     const interval = setInterval(() => {
//       setCurrentSlide(slide);

//       switch (slide) {
//         case 1:
//           setSelectedQuadrant(quadrants[quadrantIndex]);
//           quadrantIndex = (quadrantIndex + 1) % quadrants.length;
//           break;
//         case 2:
//           setSelectedTerm(termIndex);
//           termIndex = (termIndex + 1) % errorProneTerms.length;
//           break;
//         case 3:
//           setHoveredTerm(dinuIndex);
//           dinuIndex = (dinuIndex + 1) % dinuTerms.length;
//           break;
//         case 4:
//           setSelectedQuadrant(null);
//           setSelectedTerm(null);
//           setHoveredTerm(null);
//           break;
//         default:
//           break;
//       }

//       if (slide === 4 && quadrantIndex === 0) {
//         slide = 1; // Restart cycle
//       } else if (
//         (slide === 1 && quadrantIndex === 0) ||
//         (slide === 2 && termIndex === 0) ||
//         (slide === 3 && dinuIndex === 0)
//       ) {
//         slide = (slide % 4) + 1; // Move to next slide after completing examples
//       }
//     }, 2000); // 2 seconds interval for each interaction

//     return () => clearInterval(interval);
//   }, []);

//   const renderSlide = () => {
//     switch (currentSlide) {
//       case 1:
//         return (
//           <ConfusionMatrix
//             selectedQuadrant={selectedQuadrant}
//             setSelectedQuadrant={setSelectedQuadrant}
//           />
//         );
//       case 2:
//         return (
//           <ErrorProneTerms
//             selectedTerm={selectedTerm}
//             setSelectedTerm={setSelectedTerm}
//           />
//         );
//       case 3:
//         return (
//           <DINUResults
//             hoveredTerm={hoveredTerm}
//             setHoveredTerm={setHoveredTerm}
//           />
//         );
//       case 4:
//         return <SummarySlide />;
//       default:
//         return <ConfusionMatrix />;
//     }
//   };

//   return (
//     <div className='flex flex-col items-center p-4 max-w-3xl mx-auto'>
//       <div className='w-full bg-white rounded-lg shadow-md p-6 mb-4'>
//         {renderSlide()}
//       </div>

//       <div className='flex space-x-2'>
//         <button
//           className={`px-3 py-1 rounded ${
//             currentSlide === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//           onClick={() => setCurrentSlide(1)}
//         >
//           Confusion Matrix
//         </button>
//         <button
//           className={`px-3 py-1 rounded ${
//             currentSlide === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//           onClick={() => setCurrentSlide(2)}
//         >
//           Error Analysis
//         </button>
//         <button
//           className={`px-3 py-1 rounded ${
//             currentSlide === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//           onClick={() => setCurrentSlide(3)}
//         >
//           DINU Results
//         </button>
//         <button
//           className={`px-3 py-1 rounded ${
//             currentSlide === 4 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//           onClick={() => setCurrentSlide(4)}
//         >
//           Summary
//         </button>
//       </div>

//       <div className='mt-4 text-sm text-gray-600'>
//         These interactive components automatically cycle through tabs and
//         examples.
//       </div>
//     </div>
//   );
// };

const PresentationSlides = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [hoveredTerm, setHoveredTerm] = useState(null);

  useEffect(() => {
    let slide = 1;
    let quadrantIndex = 0;
    let termIndex = 0;
    let dinuIndex = 0;

    const quadrants = [
      'truePositive',
      'falsePositive',
      'falseNegative',
      'trueNegative',
    ];

    const interval = setInterval(() => {
      setCurrentSlide(slide);

      switch (slide) {
        case 1:
          setSelectedQuadrant(quadrants[quadrantIndex]);
          quadrantIndex = (quadrantIndex + 1) % quadrants.length;
          if (quadrantIndex === 0) slide = 2;
          break;

        case 2:
          setSelectedTerm(termIndex);
          termIndex = (termIndex + 1) % errorProneTerms.length;
          if (termIndex === 0) slide = 3;
          break;

        case 3:
          setHoveredTerm(dinuIndex);
          dinuIndex = (dinuIndex + 1) % dinuTerms.length;
          if (dinuIndex === 0) slide = 4;
          break;

        case 4:
          setSelectedQuadrant(null);
          setSelectedTerm(null);
          setHoveredTerm(null);
          slide = 1;
          break;

        default:
          break;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const renderSlide = () => {
    switch (currentSlide) {
      case 1:
        return <ConfusionMatrix selectedQuadrant={selectedQuadrant} />;
      case 2:
        return <ErrorProneTerms selectedTerm={selectedTerm} />;
      case 3:
        return <DINUResults hoveredTerm={hoveredTerm} />;
      case 4:
        return <SummarySlide />;
      default:
        return <ConfusionMatrix selectedQuadrant={selectedQuadrant} />;
    }
  };

  return (
    <div className='flex flex-col items-center p-4 max-w-3xl mx-auto'>
      <div className='w-full bg-white rounded-lg shadow-md p-6 mb-4'>
        {renderSlide()}
      </div>

      <div className='flex space-x-2'>
        {[1, 2, 3, 4].map(num => (
          <button
            key={num}
            className={`px-3 py-1 rounded ${currentSlide === num ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            onClick={() => setCurrentSlide(num)}
          >
            {
              ['Confusion Matrix', 'Error Analysis', 'DINU Results', 'Summary'][
              num - 1
              ]
            }
          </button>
        ))}
      </div>

      <div className='mt-4 text-sm text-gray-600'>
        Auto-cycle through tabs and examples.
      </div>
    </div>
  );
};

// export default PresentationSlides;

export default PresentationSlides;
