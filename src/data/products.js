import Images from '../Images/images'; // Import the images module

const allBrandsData = [
  {
    brand: 'Sargent',
    categories: [
      {
        name: 'Exit Devices',
        series: [
          {
            seriesName: '80 Series',
            models: [
              {
                modelNumber: '8300 Mortise Exit Device',
                functions: [
                  {
                    id: 'sargent-8304',
                    functionName: 'Night Latch (ANSI 03)',
                    description: `Key Retracts Latch -- Lever always rigid`,
                    price: 
                    4000.00,
                    imageUrl: Images.SAR8300,
                    equivalentProductIds: ['vond-9800-dt', 'best-3000-dt'],
                  },
                  {
                    id: 'sargent-8310',
                    functionName: 'Exit Only W/ No Trim (ANSI 01)',
                    description: `No outside operation.`,
                    price: 400.00,
                    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Sargent+8300L',
                    equivalentProductIds: ['vond-9800-l', 'best-3000-l'],
                  },
                                    {
                    id: 'sargent-8310-trim',
                    functionName: 'Dummy Trim (ANSI 02)',
                    description: `Rigid Lever to use as Pull.`,
                    price: 400.00,
                    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Sargent+8300L',
                    equivalentProductIds: ['vond-9800-l', 'best-3000-l'],
                  },
                ],
              },
              {
                modelNumber: '8700',
                functions: [
                  {
                    id: 'sargent-8700-10',
                    functionName: '8710 (Keyed Lever Trim)',
                    description: `Sargent 8710 Keyed Lever Trim.<br/>Key retracts latch bolt, lever rigid.`,
                    price: 450.00,
                    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Sargent+8710',
                    equivalentProductIds: ['vond-9875-dt', 'corbin-exit-ml2000-keyed'], // Example cross-mapping
                  },
                  {
                    id: 'sargent-8700-13',
                    functionName: '8713 (Dummy Lever Trim)',
                    description: `Sargent 8713 Dummy Lever Trim.<br/>Non-active outside trim, always free egress.`,
                    price: 380.00,
                    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Sargent+8713',
                    equivalentProductIds: ['vond-9875-l'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Mortise Locks',
        series: [
          {
            seriesName: '8200 Series',
            models: [
              {
                modelNumber: '8200',
                functions: [
                  {
                    id: 'sargent-8200-f01',
                    functionName: 'F01 (Passage)',
                    description: `Sargent 8200 F01 Passage.<br/>Both levers always free.`,
                    price: 280.00,
                    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Sargent+8200F01',
                    equivalentProductIds: ['corbin-ml2000-f01', 'accentra-ad-f01'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    brand: 'Von Duprin',
    categories: [
      {
        name: 'Exit Devices',
        series: [
          {
            seriesName: '98 Series',
            models: [
              {
                modelNumber: '9800',
                functions: [
                  {
                    id: 'vond-9800-dt',
                    functionName: 'DT (Dummy Trim)',
                    description: `Von Duprin 9800 Dummy Trim.<br/>Non-active outside trim.`,
                    price: 380.00,
                    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=VonDuprin+9800DT',
                    equivalentProductIds: ['sargent-8300-dt', 'best-3000-dt'],
                  },
                  {
                    id: 'vond-9800-l',
                    functionName: 'L (Lever Trim)',
                    description: `Von Duprin 9800 Lever Trim.<br/>Active lever for outside operation.`,
                    price: 430.00,
                    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=VonDuprin+9800L',
                    equivalentProductIds: ['sargent-8300-l', 'best-3000-l'],
                  },
                ],
              },
              {
                modelNumber: '9875', // Specific model for 98 series
                functions: [
                  {
                    id: 'vond-9875-dt',
                    functionName: '9875 DT (Dummy Trim)',
                    description: `Von Duprin 9875 Dummy Trim.<br/>Used where outside trim is required but no key or lever operation.`,
                    price: 480.00,
                    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=VonDuprin+9875DT',
                    equivalentProductIds: ['sargent-8700-10'],
                  },
                  {
                    id: 'vond-9875-l',
                    functionName: '9875 L (Lever Trim)',
                    description: `Von Duprin 9875 Lever Trim.<br/>Lever on outside, active.`,
                    price: 410.00,
                    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=VonDuprin+9875L',
                    equivalentProductIds: ['sargent-8700-13'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    brand: 'Best',
    categories: [
      {
        name: 'Exit Devices',
        series: [
          {
            seriesName: '3000 Series',
            models: [
              {
                modelNumber: '3000',
                functions: [
                  {
                    id: 'best-3000-dt',
                    functionName: 'DT (Dummy Trim)',
                    description: `Best 3000 Dummy Trim.<br/>Non-keyed, non-active trim.`,
                    price: 370.00,
                    imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Best+3000DT',
                    equivalentProductIds: ['sargent-8300-dt', 'vond-9800-dt'],
                  },
                  {
                    id: 'best-3000-l',
                    functionName: 'L (Lever Trim)',
                    description: `Best 3000 Lever Trim.<br/>Active lever outside.`,
                    price: 420.00,
                    imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Best+3000L',
                    equivalentProductIds: ['sargent-8300-l', 'vond-9800-l'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    brand: 'Corbin',
    categories: [
      {
        name: 'Mortise Locks',
        series: [
          {
            seriesName: 'ML2000 Series',
            models: [
              {
                modelNumber: 'ML2000',
                functions: [
                  {
                    id: 'corbin-ml2000-f01',
                    functionName: 'F01 (Passage)',
                    description: `Corbin Russwin ML2000 F01.<br/>Levers always free, no locking.`,
                    price: 290.00,
                    imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=Corbin+ML2000F01',
                    equivalentProductIds: ['sargent-8200-f01', 'accentra-ad-f01'],
                  },
                  {
                    id: 'corbin-exit-ml2000-keyed', // Example of a potentially different naming convention
                    functionName: 'Keyed (Exit Trim)',
                    description: `Corbin ML2000 Keyed Exit Trim.<br/>Similar function to Sargent 8710.`,
                    price: 460.00,
                    imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=Corbin+ML2000+Exit',
                    equivalentProductIds: ['sargent-8700-10'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    brand: 'Accentra',
    categories: [
      {
        name: 'Mortise Locks',
        series: [
          {
            seriesName: 'AD-Series',
            models: [
              {
                modelNumber: 'AD-99', // Example model for AD-Series
                functions: [
                  {
                    id: 'accentra-ad-f01',
                    functionName: 'F01 (Passage)',
                    description: `Accentra AD-Series F01.<br/>Electronic passage function.`,
                    price: 320.00,
                    imageUrl: 'https://via.placeholder.com/150/00FFFF/000000?text=Accentra+AD-F01',
                    equivalentProductIds: ['sargent-8200-f01', 'corbin-ml2000-f01'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default allBrandsData;