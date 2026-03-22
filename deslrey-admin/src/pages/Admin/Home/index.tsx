import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import styles from './index.module.scss'
import request from '../../../utils/http'
import { articleApi, visitApi } from '../../../api'

const Home: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null)
    const totalVisitsRef = useRef<HTMLDivElement>(null)
    const weekVisitsRef = useRef<HTMLDivElement>(null)
    const articleCountRef = useRef<HTMLDivElement>(null)
    let chartInstance: echarts.ECharts | null = null
    let weekVisitsInstance: echarts.ECharts | null = null
    let articleCountInstance: echarts.ECharts | null = null

    const initChart = (data: any[]) => {
        if (!chartRef.current) return
        if (chartInstance) {
            chartInstance.dispose()
        }
        chartInstance = echarts.init(chartRef.current)

        const option = {
            title: { 
                text: '文章浏览量统计', 
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'normal',
                    color: '#333'
                }
            },
            tooltip: { 
                trigger: 'item', 
                formatter: '{b}: {c} ({d}%)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#e8e8e8',
                borderWidth: 1,
                textStyle: {
                    color: '#333'
                }
            },
            legend: { 
                orient: 'vertical', 
                left: 'left',
                top: 50,
                textStyle: {
                    color: '#666'
                },
                itemWidth: 10,
                itemHeight: 10
            },
            series: [
                {
                    name: '浏览量',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '16',
                            fontWeight: 'bold',
                            color: '#333'
                        },
                        itemStyle: {
                            shadowBlur: 15,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: data.map(item => ({ name: item.title, value: item.views })),
                    color: ['#409eff', '#52c41a', '#faad14', '#fa541c', '#f5222d', '#722ed1', '#13c2c2']
                }
            ]
        }

        chartInstance.setOption(option)
    }

    const initTotalVisitsChart = (totalVisits: number) => {
        if (!totalVisitsRef.current) return

        const validVisits = typeof totalVisits === 'number' && !isNaN(totalVisits) ? totalVisits : 0;

        // 直接创建卡片HTML，不使用echarts
        totalVisitsRef.current.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; padding: 20px;">
                <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: normal;">总访问量</h3>
                <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">${validVisits.toLocaleString()}</div>
                <div style="font-size: 14px; opacity: 0.9;">网站总访问次数</div>
            </div>
        `
    }

    const initWeekVisitsChart = (data: any[]) => {
        if (!weekVisitsRef.current) return
        // 检查是否已经存在图表实例，如果存在则销毁
        if (weekVisitsInstance) {
            weekVisitsInstance.dispose()
        }
        weekVisitsInstance = echarts.init(weekVisitsRef.current)

        const option = {
            title: { 
                text: '近七天访问量', 
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'normal',
                    color: '#333'
                }
            },
            tooltip: { 
                trigger: 'axis',
                formatter: function(params: any) {
                    return params[0].name + ': ' + params[0].value + ' 次';
                }
            },
            legend: { 
                data: ['访问量'], 
                top: 50,
                textStyle: {
                    color: '#666'
                }
            },
            grid: { 
                left: '3%', 
                right: '4%', 
                bottom: '3%', 
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.map(item => item.date),
                axisLine: {
                    lineStyle: {
                        color: '#e8e8e8'
                    }
                },
                axisLabel: {
                    color: '#666'
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0'
                    }
                },
                axisLabel: {
                    color: '#666'
                }
            },
            series: [
                {
                    name: '访问量',
                    type: 'line',
                    stack: 'Total',
                    data: data.map(item => item.count),
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        color: '#409eff'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(64, 158, 255, 0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(64, 158, 255, 0.1)'
                            }
                        ])
                    },
                    itemStyle: {
                        color: '#409eff',
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    emphasis: {
                        focus: 'series',
                        itemStyle: {
                            borderWidth: 4
                        }
                    }
                }
            ]
        }

        weekVisitsInstance.setOption(option)
    }

    const initArticleCountChart = (data: any[]) => {
        if (!articleCountRef.current) return
        // 检查是否已经存在图表实例，如果存在则销毁
        if (articleCountInstance) {
            articleCountInstance.dispose()
        }
        articleCountInstance = echarts.init(articleCountRef.current)

        const option = {
            title: { 
                text: '文章发布数', 
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'normal',
                    color: '#333'
                }
            },
            tooltip: { 
                trigger: 'axis',
                formatter: function(params: any) {
                    return params[0].name + ': ' + params[0].value + ' 篇';
                }
            },
            legend: { 
                data: ['发布数'], 
                top: 50,
                textStyle: {
                    color: '#666'
                }
            },
            grid: { 
                left: '3%', 
                right: '4%', 
                bottom: '3%', 
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.map(item => item.month),
                axisLine: {
                    lineStyle: {
                        color: '#e8e8e8'
                    }
                },
                axisLabel: {
                    color: '#666'
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0'
                    }
                },
                axisLabel: {
                    color: '#666'
                }
            },
            series: [
                {
                    name: '发布数',
                    type: 'line',
                    data: data.map(item => item.count),
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        color: '#409eff'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(64, 158, 255, 0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(64, 158, 255, 0.1)'
                            }
                        ])
                    },
                    itemStyle: {
                        color: '#409eff',
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    emphasis: {
                        focus: 'series',
                        itemStyle: {
                            borderWidth: 4
                        }
                    }
                }
            ]
        }

        articleCountInstance.setOption(option)
    }

    const fetchData = async () => {
        try {
            const res = await request.get(articleApi.viewHot)
            console.log('res =====> ', res.data)
            const chartData = Array.isArray(res.data) ? res.data : []
            initChart(chartData)
        } catch (err) {
            console.error('获取数据失败', err)
            initChart([])
        }
    }

    const fetchTotalVisits = async () => {
        try {
            const res = await request.get(visitApi.stats)
            const totalVisits = res.data?.totalVisits ?? 0
            initTotalVisitsChart(totalVisits)
        } catch (err) {
            console.error('获取总访问量失败', err)
            initTotalVisitsChart(0)
        }
    }

    const fetchWeekVisits = async () => {
        try {
            const res = await request.get(visitApi.weekly)
            const weekData = Array.isArray(res.data) ? res.data : []
            initWeekVisitsChart(weekData)
        } catch (err) {
            console.error('获取近七天访问量失败', err)
            initWeekVisitsChart([])
        }
    }

    const fetchArticleCount = async () => {
        try {
            const res = await request.get(articleApi.counts)
            const rawData = Array.isArray(res.data) ? res.data : []
            const articleData = rawData.map((item: any) => ({
                month: `${item.month ?? '未知'}月`,
                count: typeof item.count === 'number' ? item.count : 0
            }))
            initArticleCountChart(articleData)
        } catch (err) {
            console.error('获取文章发布数失败', err)
            initArticleCountChart([])
        }
    }

    useEffect(() => {
        fetchData()
        fetchTotalVisits()
        fetchWeekVisits()
        fetchArticleCount()
        
        const resizeChart = () => {
            chartInstance?.resize()
            weekVisitsInstance?.resize()
            articleCountInstance?.resize()
        }
        
        window.addEventListener('resize', resizeChart)
        return () => {
            window.removeEventListener('resize', resizeChart)
            chartInstance?.dispose()
            weekVisitsInstance?.dispose()
            articleCountInstance?.dispose()
        }
    }, [])

    return <div className={styles.homeBox}>
        <div className={styles.chartRow}>
            <div className={styles.chartItem} ref={totalVisitsRef}></div>
            <div className={styles.chartItem} ref={weekVisitsRef}></div>
        </div>
        <div className={styles.chartRow}>
            <div className={styles.chartItem} ref={articleCountRef}></div>
            <div className={styles.chartItem} ref={chartRef}></div>
        </div>
    </div>
}

export default Home
