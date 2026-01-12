import React from 'react';
import { X } from 'lucide-react';

interface InspectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InspectionModal: React.FC<InspectionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const scheduleData = [
        { month: '1월', date: '15일(목)', time: '10시 ~ 12시', branch: '강북 사무소', manager: '이상기 부장', visitor: '김은정' },
        { month: '1월', date: '19일(월)', time: '10시 ~ 12시', branch: '강릉 사무소', manager: '박상기 차장', visitor: '강규진' },
        { month: '1월', date: '19일(월)', time: '14시 ~ 16시', branch: '원주 사무소', manager: '김정민 부장', visitor: '강규진' },
        { month: '1월', date: '19일(월)', time: '10시 ~ 12시', branch: '전남 사무소', manager: '유상석 부장', visitor: '김민구' },
        { month: '1월', date: '19일(월)', time: '10시 ~ 12시', branch: '경북1 사무소\n경북2 사무소', manager: '이한규 부장', visitor: '김은정' },
        { month: '1월', date: '20일(화)', time: '10시 ~ 12시', branch: '경기1 사무소', manager: '정보식 부장', visitor: '김민구' },
        { month: '1월', date: '20일(화)', time: '14시 ~ 16시', branch: '경기2 사무소', manager: '백재웅 부장', visitor: '김민구' },
        { month: '1월', date: '21일(수)', time: '10시 ~ 12시', branch: '제주 사무소', manager: '김현우 부장', visitor: '강규진' },
        { month: '2월', date: '9일(월)', time: '10시 ~ 12시', branch: '경남 사무소', manager: '남선환 부장', visitor: '김민구' },
        { month: '2월', date: '23일(월)', time: '10시 ~ 12시', branch: '충북 사무소', manager: '이재형 부장', visitor: '강규진' },
        { month: '2월', date: '23일(월)', time: '14시 ~ 16시', branch: '충남 사무소', manager: '최순원 부장', visitor: '강규진' },
        { month: '2월', date: '23일(월)', time: '10시 ~ 12시', branch: '부산1 사무소\n부산2 사무소', manager: '편진근 부장', visitor: '김은정' },
        { month: '2월', date: '24일(화)', time: '10시 ~ 12시', branch: '전북 사무소', manager: '최창현 차장', visitor: '김민구' },
        { month: '3월', date: '16일(월)', time: '10시 ~ 12시', branch: '중부 사무소', manager: '홍민표 부장', visitor: '강규진' },
        { month: '3월', date: '17일(화)', time: '10시 ~ 12시', branch: '서부 사무소', manager: '박종현 부장', visitor: '김은정' },
        { month: '3월', date: '17일(화)', time: '14시 ~ 16시', branch: '인천 사무소', manager: '김장민 부장', visitor: '김은정' },
        { month: '3월', date: '23일(월)', time: '10시 ~ 12시', branch: '강남 사무소', manager: '이태희 부장\n김 훈 부장\n진기만 부장', visitor: '김민구\n강규진\n김은정' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-[95%] md:w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-4 py-4 md:px-8 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                        📋 영업사무소 점검 일정 (1분기)
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-3 md:p-6 overflow-y-auto custom-scrollbar">
                    <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                        <table className="w-full text-sm text-left min-w-[600px]">
                            <thead className="bg-[#0f172a] text-white">
                                <tr>
                                    <th className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-slate-700 font-bold whitespace-nowrap">월</th>
                                    <th className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-slate-700 font-bold whitespace-nowrap">방문 일정</th>
                                    <th className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-slate-700 font-bold whitespace-nowrap">방문 시간</th>
                                    <th className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-slate-700 font-bold whitespace-nowrap">방문 지점</th>
                                    <th className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-slate-700 font-bold whitespace-nowrap">관리감독자</th>
                                    <th className="px-3 py-2 md:px-4 md:py-3 text-center font-bold whitespace-nowrap">방문자</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {scheduleData.map((row, index) => {
                                    const isFirstInMonth = index === 0 || row.month !== scheduleData[index - 1].month;
                                    let rowSpan = 1;
                                    if (isFirstInMonth) {
                                        for (let i = index + 1; i < scheduleData.length; i++) {
                                            if (scheduleData[i].month === row.month) {
                                                rowSpan++;
                                            } else {
                                                break;
                                            }
                                        }
                                    }

                                    return (
                                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                            {isFirstInMonth && (
                                                <td
                                                    rowSpan={rowSpan}
                                                    className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-b border-slate-200 font-bold text-slate-800 bg-white align-middle"
                                                >
                                                    {row.month}
                                                </td>
                                            )}
                                            <td className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-slate-100 text-slate-600 whitespace-nowrap">{row.date}</td>
                                            <td className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-slate-100 text-slate-600 whitespace-nowrap">{row.time}</td>
                                            <td className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-slate-100 text-slate-700 font-medium whitespace-pre-line min-w-[100px]">{row.branch}</td>
                                            <td className="px-3 py-2 md:px-4 md:py-3 text-center border-r border-slate-100 text-slate-600 whitespace-pre-line">{row.manager}</td>
                                            <td className="px-3 py-2 md:px-4 md:py-3 text-center text-slate-700 font-medium whitespace-pre-line bg-slate-50/30">{row.visitor}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 md:px-8 md:py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 md:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors shadow-lg shadow-slate-200 text-sm md:text-base"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InspectionModal;
