import React, { useEffect, useReducer, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import useStore from '../../hooks/useStore';
import { getErrorMsg } from '../../utils/error';
import { roundToTwoDec } from '../../utils/helpers';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { adminSidebarItems } from '../../constants';
import Spinner from '../../components/Spinner';
import { IAction } from '../../constants';

ChartJS.register(CategoryScale, LinearScale, BarElement);

interface ISalesMetric {
  _id: string;
  total: number;
}

interface ISummary {
  ordersPrice: number;
  ordersCount: number;
  salesData: ISalesMetric[];
  productsCount: number;
  usersCount: number;
}

interface IState {
  loading: boolean;
  error?: string;
  summary: ISummary;
}

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const Grid = ({ children }: { children: ReactNode }) => (
  <section className='grid w-full grid-cols-2 gap-4 sm:grid-cols-4'>
    {children}
  </section>
);

const Card = ({
  figure,
  title,
  link,
}: {
  figure: string;
  title: string;
  link: string;
}) => (
  <div className='w-full p-4 text-center border rounded shadow-md border-skin-muted'>
    <p className='text-lg font-medium tracking-wider'>{figure}</p>
    <h3 className='text-sm'>{title}</h3>
    <Link href={`/admin/${link}`}>
      <a className='block w-full px-2 py-1 mt-2 text-sm font-light rounded text-skin-accent hover:text-skin-accent-hover'>
        View
      </a>
    </Link>
  </div>
);

function AdminDashboard() {
  const router = useRouter();

  const value = useStore();
  const { state } = value;
  const { userInfo } = state;

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: {
      ordersPrice: 0,
      ordersCount: 0,
      salesData: [],
      productsCount: 0,
      usersCount: 0,
    },
    error: '',
  });

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: getErrorMsg(error) });
      }
    };

    fetchData();
  }, [router, userInfo]);

  // Workaround to pass colors to charts dynamically
  const style = getComputedStyle(document.body);
  const fillAccent = style.getPropertyValue('--color-fill-accent');

  return (
    <Layout title='Order History'>
      <div className='container p-6 mx-auto'>
        <div className='grid-cols-6 md:grid'>
          <Sidebar items={adminSidebarItems} activeItem='dashboard' />
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            {loading ? (
              <Spinner size='5' message='Loading...' />
            ) : error ? (
              <span className='text-lg font-light tracking-wider text-skin-error'>
                Error: {error}
              </span>
            ) : (
              <>
                <Grid>
                  <Card
                    figure={`£${roundToTwoDec(summary.ordersPrice)}`}
                    title='Sales'
                    link='orders'
                  />
                  <Card
                    figure={`${summary.ordersCount}`}
                    title='Orders'
                    link='orders'
                  />
                  <Card
                    figure={`${summary.productsCount}`}
                    title='Products'
                    link='products'
                  />
                  <Card
                    figure={`${summary.usersCount}`}
                    title='Users'
                    link='users'
                  />
                </Grid>
                <div className='mt-8'>
                  <h2 className='p-2 mb-4 font-medium tracking-wide'>
                    Sales Per Month
                  </h2>
                  <Bar
                    data={{
                      labels: summary.salesData.map((d: ISalesMetric) => d._id),
                      datasets: [
                        {
                          label: 'Sales',
                          backgroundColor: fillAccent,
                          data: summary.salesData.map(
                            (d: ISalesMetric) => d.total
                          ),
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: { display: true, position: 'right' },
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
