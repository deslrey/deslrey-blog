import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import styles from './index.module.scss'
import request from '../../../utils/request'
import { articleApi } from '../../../api'

const Home: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null)
    let chartInstance: echarts.ECharts | null = null

    const initChart = (data: any[]) => {
        if (!chartRef.current) return
        chartInstance = echarts.init(chartRef.current)

        const option = {
            title: { text: '文章浏览量统计', left: 'center' },
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            legend: { orient: 'vertical', left: 'left' },
            series: [
                {
                    name: '浏览量',
                    type: 'pie',
                    radius: '50%',
                    data: data.map(item => ({ name: item.title, value: item.views })),
                    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
                }
            ]
        }

        chartInstance.setOption(option)
    }

    const fetchData = async () => {
        try {
            const res = await request.get(articleApi.viewHot)
            console.log('res =====> ', res.data)
            initChart(res.data)
        } catch (err) {
            console.error('获取数据失败', err)
        }
    }

    useEffect(() => {
        fetchData()
        const resizeChart = () => chartInstance?.resize()
        window.addEventListener('resize', resizeChart)
        return () => {
            window.removeEventListener('resize', resizeChart)
            chartInstance?.dispose()
        }
    }, [])

    return <div className={styles.homeBox}>
        <div className={styles.peiBox} ref={chartRef}></div>
    </div>
}

export default Home
