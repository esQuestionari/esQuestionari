import { Box, Skeleton, useTheme } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { merge } from 'lodash';

const chartOptions = {
  chart: {
    animations: {
      speed: 400,
      animateGradually: {
        enabled: true,
      },
    },
    fontFamily: 'inherit',
    foreColor: 'inherit',
    height: '100%',
    type: 'donut',
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    pie: {
      customScale: 0.9,
      expandOnClick: false,
      donut: {
        size: '50%',
      },
    },
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
    active: {
      filter: {
        type: 'none',
      },
    },
  },
  tooltip: {
    enabled: true,
    fillSeriesColor: false,
    theme: 'dark',
    custom: ({ seriesIndex, w }) =>
      `<div class="flex items-center h-32 min-h-32 max-h-23 px-12">
			<div class="w-12 h-12 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
			<div class="ml-8 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
			<div class="ml-8 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
		</div>`,
  },
  labels: [],
  series: [],
};

const emptyOptions = {
  chart: {
    animations: {
      speed: 0,
      animateGradually: {
        enabled: false,
      },
    },
    fontFamily: 'inherit',
    foreColor: 'inherit',
    height: '100%',
    type: 'donut',
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    pie: {
      customScale: 0.9,
      expandOnClick: false,
      donut: {
        size: '50%',
      },
    },
  },
  tooltip: {
    enabled: false,
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
    active: {
      filter: {
        type: 'none',
      },
    },
  },
};

const DonutChart = ({ series, labels, colors, options, loaded }) => {
  const containerRef = useRef();
  const theme = useTheme();

  const [donutOptions, setDonutOption] = useState(false);
  const [option, setOption] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [chartInitialOptions, setChartInitialOptions] = useState(chartOptions);

  useEffect(() => {
    if (containerRef.current) {
      setOption({
        w: containerRef.current.offsetWidth,
        h: containerRef.current.offsetHeight,
      });
    }
  }, [containerRef.current]);

  useEffect(() => {
    if (option) {
      let args = merge(chartInitialOptions, options, { colors, series, labels });
      if (labels.length > 0) {
        setIsEmpty(false);
      } else {
        args = merge(emptyOptions, options, {
          colors: [theme.palette.background.default],
          series: [100],
        });
        setIsEmpty(true);
      }
      setDonutOption(args);
    }
    return () => setChartInitialOptions({});
  }, [labels, options, colors, option]);

  return (
    <Box ref={containerRef} className='flex h-full w-full items-center justify-center'>
      {loaded && donutOptions ? (
        <ReactApexChart
          className='flex h-full w-full flex-auto items-center justify-center'
          options={donutOptions}
          series={donutOptions.series}
          type='donut'
          height={option.w}
        />
      ) : (
        <Skeleton
          className='relative'
          variant='circular'
          width={option.w ? option.w * 0.9 : 0}
          height={option.w ? option.w * 0.9 : 0}
        />
      )}
    </Box>
  );
};

DonutChart.defaultProps = {
  options: {},
  series: [],
  labels: [],
  colors: [],
  loaded: false,
};

DonutChart.propTypes = {
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  loaded: PropTypes.bool.isRequired,
};

export default DonutChart;
