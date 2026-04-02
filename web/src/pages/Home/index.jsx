/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
} from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';

const { Text } = Typography;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  useEffect(() => {
    const sections = document.querySelectorAll('.snap-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [homePageContentLoaded, homePageContent]);

  return (
    <div className='w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='w-full h-screen overflow-y-scroll snap-y snap-mandatory'>
          {/* Banner 部分 */}
          <div className='snap-start snap-section w-full h-screen border-b border-semi-color-border relative overflow-hidden'>
            {/* 背景模糊晕染球 */}
            <div className='blur-ball blur-ball-indigo' />
            <div className='blur-ball blur-ball-teal' />
            <div className='flex items-center justify-center h-full px-4 pt-16'>
              <div className='max-w-7xl mx-auto w-full'>
                {/* 顶部标签 */}
                <div className='mb-8 md:mb-12 animate-fade-in-up delay-0'>
                  <span className='inline-block px-4 py-2 rounded-full border border-semi-color-border bg-semi-color-bg-1 text-sm text-semi-color-text-1'>
                    {t('面向企业的 AI 生产力基座')}
                  </span>
                </div>

                {/* 左右分栏布局 */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
                  {/* 左侧内容 */}
                  <div className='flex flex-col justify-center animate-fade-in-left delay-100'>
                    <h1
                      className={`text-3xl md:text-4xl lg:text-5xl font-bold text-semi-color-text-0 leading-tight mb-6 ${isChinese ? 'tracking-wide' : ''}`}
                    >
                      {t('统一的大模型接口网关')}
                      <br />
                      {t('链接')}
                      <span className='rainbow-text'>{t('全球')}</span>
                      {' '}{t('AI 能力')}
                    </h1>
                    <p className='text-base md:text-lg text-semi-color-text-1 mb-6'>
                      {t('以一套域名、密钥与风控策略连接全球大模型资源，保障可观测、可拓展、可控。')}
                    </p>

                    {/* URL 输入框 */}
                    <div className='mb-6'>
                      <Input
                        readonly
                        value={serverAddress}
                        className='!rounded-full'
                        size='large'
                        suffix={
                          <div className='flex items-center gap-2'>
                            <ScrollList
                              bodyHeight={32}
                              style={{ border: 'unset', boxShadow: 'unset' }}
                            >
                              <ScrollItem
                                mode='wheel'
                                cycled={true}
                                list={endpointItems}
                                selectedIndex={endpointIndex}
                                onSelect={({ index }) => setEndpointIndex(index)}
                              />
                            </ScrollList>
                            <Button
                              type='primary'
                              onClick={handleCopyBaseURL}
                              icon={<IconCopy />}
                              className='!rounded-full'
                            />
                          </div>
                        }
                      />
                    </div>

                    {/* 操作按钮 */}
                    <div className='flex flex-row gap-4 mb-8'>
                      <Link to='/console'>
                        <Button
                          theme='solid'
                          type='primary'
                          size='large'
                          className='!rounded-3xl px-8 py-2'
                          icon={<IconPlay />}
                        >
                          {t('获取密钥')}
                        </Button>
                      </Link>
                      {docsLink && (
                        <Button
                          size='large'
                          className='flex items-center !rounded-3xl px-6 py-2'
                          icon={<IconFile />}
                          onClick={() => window.open(docsLink, '_blank')}
                        >
                          {t('文档')}
                        </Button>
                      )}
                    </div>

                    {/* 统计数据 */}
                    <div className='flex gap-4'>
                      <div className='flex-1 p-4 rounded-xl border border-semi-color-border bg-semi-color-bg-1'>
                        <div className='text-3xl font-bold text-semi-color-text-0'>30+</div>
                        <div className='text-sm text-semi-color-text-2 mt-1'>{t('可覆盖模型')}</div>
                      </div>
                      <div className='flex-1 p-4 rounded-xl border border-semi-color-border bg-semi-color-bg-1'>
                        <div className='text-3xl font-bold text-semi-color-text-0'>99.9%</div>
                        <div className='text-sm text-semi-color-text-2 mt-1'>{t('SLA 可用性')}</div>
                      </div>
                      <div className='flex-1 p-4 rounded-xl border border-semi-color-border bg-semi-color-bg-1'>
                        <div className='text-3xl font-bold text-semi-color-text-0'>7</div>
                        <div className='text-sm text-semi-color-text-2 mt-1'>{t('多区域节点')}</div>
                      </div>
                    </div>
                  </div>

                  {/* 右侧特性卡片 */}
                  <div className='p-6 rounded-3xl border border-blue-200/50 dark:border-blue-400/20 animate-fade-in-right delay-200 backdrop-blur-sm flex flex-col justify-center' style={{background: 'linear-gradient(135deg, rgba(147,197,253,0.35) 0%, rgba(167,139,250,0.22) 100%)'}}>
                    <div className='flex flex-col gap-4 w-full'>
                      <div className='p-6 rounded-2xl bg-semi-color-bg-0 border border-semi-color-border'>
                        <div className='flex items-start gap-4'>
                          <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0'>
                            <svg className='w-6 h-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                            </svg>
                          </div>
                        <div>
                          <h3 className='text-lg font-semibold text-semi-color-text-0 mb-2'>{t('实时调度')}</h3>
                          <p className='text-sm text-semi-color-text-2'>{t('健康度与延迟权重动态切换，保证最优响应。')}</p>
                        </div>
                      </div>
                    </div>

                    <div className='p-6 rounded-2xl bg-semi-color-bg-0 border border-semi-color-border'>
                      <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0'>
                          <svg className='w-6 h-6 text-purple-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                          </svg>
                        </div>
                        <div>
                          <h3 className='text-lg font-semibold text-semi-color-text-0 mb-2'>{t('统一监控')}</h3>
                          <p className='text-sm text-semi-color-text-2'>{t('调用、费用、异常一站式可视化，随时掌握运行状态。')}</p>
                        </div>
                      </div>
                    </div>

                    <div className='p-6 rounded-2xl bg-semi-color-bg-0 border border-semi-color-border'>
                      <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0'>
                          <svg className='w-6 h-6 text-teal-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' />
                          </svg>
                        </div>
                        <div>
                          <h3 className='text-lg font-semibold text-semi-color-text-0 mb-2'>{t('智能限流')}</h3>
                          <p className='text-sm text-semi-color-text-2'>{t('多维策略保障核心业务优先级，避免突发资源耗尽。')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 核心价值区块 */}
            </div>
          </div>
        </div>

        {/* 第2页：核心价值 */}
        <div className='snap-start snap-section w-full h-screen flex items-center border-b border-semi-color-border overflow-hidden'>
          <div className='w-full px-8 md:px-16'>
            <div className='max-w-7xl mx-auto'>
              <div className='mb-12 animate-fade-in-up delay-0'>
                <p className='text-sm text-semi-color-text-2 mb-3'>{t('核心价值')}</p>
                <h2 className='text-3xl md:text-4xl font-bold text-semi-color-text-0 mb-4'>
                  {t('让团队稳定使用大模型，更快落地 AI 创新')}
                </h2>
                <p className='text-base text-semi-color-text-1'>
                  {t('从访问控制、成本可视化到全局调度，为企业提供端到端的 AI 基础设施能力。')}
                </p>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='p-8 rounded-2xl border border-semi-color-border bg-semi-color-bg-0 animate-fade-in-up delay-100'>
                  <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5'>
                    <svg className='w-6 h-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-bold text-semi-color-text-0 mb-2'>{t('统一入口，极速连通')}</h3>
                  <p className='text-sm text-semi-color-text-2'>{t('以单一域名和密钥连接全部大模型供应商，智能容灾切换确保业务不中断。')}</p>
                </div>
                <div className='p-8 rounded-2xl border border-semi-color-border bg-semi-color-bg-0 animate-fade-in-up delay-200'>
                  <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5'>
                    <svg className='w-6 h-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-bold text-semi-color-text-0 mb-2'>{t('全栈可观测与风控')}</h3>
                  <p className='text-sm text-semi-color-text-2'>{t('实时监控调用量、错误率与费用，一键配置限流、告警与安全策略。')}</p>
                </div>
                <div className='p-8 rounded-2xl border border-semi-color-border bg-semi-color-bg-0 animate-fade-in-up delay-300'>
                  <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5'>
                    <svg className='w-6 h-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-bold text-semi-color-text-0 mb-2'>{t('按需扩容与成本优化')}</h3>
                  <p className='text-sm text-semi-color-text-2'>{t('多渠道配额、智能路由与批量任务调度，灵活控制成本与并发能力。')}</p>
                </div>
                <div className='p-8 rounded-2xl border border-semi-color-border bg-semi-color-bg-0 animate-fade-in-up delay-400'>
                  <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5'>
                    <svg className='w-6 h-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-bold text-semi-color-text-0 mb-2'>{t('开发者友好体验')}</h3>
                  <p className='text-sm text-semi-color-text-2'>{t('兼容 OpenAI 接口协议，提供 SDK、示例与 Web Playground，轻松迭代上线。')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 第3页：工作流 */}
        <div className='snap-start snap-section w-full h-screen flex items-center border-b border-semi-color-border overflow-hidden'>
          <div className='w-full px-8 md:px-16'>
            <div className='max-w-7xl mx-auto'>
              <div className='mb-12 animate-fade-in-up delay-0'>
                <p className='text-sm text-semi-color-text-2 mb-3'>{t('工作流')}</p>
                <h2 className='text-3xl md:text-4xl font-bold text-semi-color-text-0'>
                  {t('用 3 个步骤构建你的 AI 控制平面')}
                </h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='p-8 rounded-2xl border border-semi-color-border bg-semi-color-bg-0 animate-fade-in-up delay-100'>
                  <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6'>
                    <svg className='w-6 h-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                    </svg>
                  </div>
                  <p className='text-sm text-semi-color-text-2 mb-2'>01</p>
                  <h3 className='text-lg font-bold text-semi-color-text-0 mb-3'>{t('接入配置')}</h3>
                  <p className='text-sm text-semi-color-text-2'>{t('在控制台创建渠道、设置密钥与限额，导入模型列表。')}</p>
                </div>
                <div className='p-8 rounded-2xl border border-semi-color-border bg-semi-color-bg-0 animate-fade-in-up delay-200'>
                  <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6'>
                    <svg className='w-6 h-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                  <p className='text-sm text-semi-color-text-2 mb-2'>02</p>
                  <h3 className='text-lg font-bold text-semi-color-text-0 mb-3'>{t('智能调度')}</h3>
                  <p className='text-sm text-semi-color-text-2'>{t('根据健康度、延迟与价格自动选择最优模型通道，内置故障切换。')}</p>
                </div>
                <div className='p-8 rounded-2xl border border-semi-color-border bg-semi-color-bg-0 animate-fade-in-up delay-300'>
                  <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6'>
                    <svg className='w-6 h-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                    </svg>
                  </div>
                  <p className='text-sm text-semi-color-text-2 mb-2'>03</p>
                  <h3 className='text-lg font-bold text-semi-color-text-0 mb-3'>{t('持续洞察')}</h3>
                  <p className='text-sm text-semi-color-text-2'>{t('通过仪表盘追踪调用趋势、消耗与失败率，实时告警确保 SLO。')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 第4页：生态伙伴 */}
        <div className='snap-start snap-section w-full h-screen flex items-center overflow-hidden'>
          <div className='w-full px-8 md:px-16'>
            <div className='max-w-7xl mx-auto'>
              <div className='text-center mb-12 animate-fade-in-up delay-0'>
                <p className='text-sm text-semi-color-text-2 mb-3'>{t('生态伙伴')}</p>
                <h2 className='text-3xl md:text-4xl font-bold text-semi-color-text-0 mb-4'>
                  {t('与主流模型供应商深度对接')}
                </h2>
                <p className='text-base text-semi-color-text-1'>
                  {t('保持统一协议，快速切换与扩展模型能力，随时接入最新生态。')}
                </p>
              </div>
              <div className='grid grid-cols-7 gap-x-8 gap-y-10 max-w-4xl mx-auto place-items-center animate-fade-in-up delay-200'>
                <Moonshot size={48} />
                <OpenAI size={48} />
                <Midjourney size={48} />
                <Zhipu.Color size={48} />
                <Volcengine.Color size={48} />
                <Minimax.Color size={48} />
                <Claude.Color size={48} />
                <Gemini.Color size={48} />
                <Suno size={48} />
                <Cohere.Color size={48} />
                <DeepSeek.Color size={48} />
                <Qwen.Color size={48} />
                <Grok size={48} />
                <XAI size={48} />
                <Spark.Color size={48} />
                <Xinference.Color size={48} />
                <Hunyuan.Color size={48} />
                <Qingyan.Color size={48} />
                <AzureAI.Color size={48} />
                <Midjourney size={48} />
                <Typography.Text className='!text-2xl font-bold text-semi-color-text-0'>30+</Typography.Text>
              </div>
            </div>
          </div>
        </div>

        {/* 第5页：CTA */}
        <div className='snap-start snap-section w-full h-screen flex items-center justify-center overflow-hidden'>
          <div className='w-full max-w-3xl mx-auto px-8'>
            <div className='p-16 rounded-3xl border border-semi-color-border bg-semi-color-bg-1 text-center animate-fade-in-up delay-0'>
              <h2 className='text-3xl md:text-4xl font-bold text-semi-color-text-0 mb-4'>
                {t('将大模型能力真正落地到业务流程')}
              </h2>
              <p className='text-base text-semi-color-text-2 mb-10'>
                {t('立即接入，统一控制访问策略与调用成本，为产品带来稳定、可扩展的智能体验。')}
              </p>
              <div className='flex flex-row gap-4 justify-center items-center'>
                <Button
                  theme='solid'
                  type='primary'
                  size='large'
                  className='!rounded-3xl px-10 py-2'
                  icon={<IconPlay />}
                  onClick={() => window.open('https://ai.api96.com/', '_blank')}
                >
                  {t('立即开始')}
                </Button>
                {docsLink ? (
                  <Button
                    size='large'
                    className='flex items-center !rounded-3xl px-8 py-2'
                    icon={<IconFile />}
                    onClick={() => window.open('https://a.api96.com/', '_blank')}
                  >
                    {t('查看文档')}
                  </Button>
                ) : (
                  <Button
                    size='large'
                    className='flex items-center !rounded-3xl px-8 py-2'
                    icon={<IconFile />}
                    onClick={() => window.open('https://a.api96.com/', '_blank')}
                  >
                    {t('查看文档')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>

      ) : (
        <div className='overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-screen border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
