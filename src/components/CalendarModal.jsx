import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { addEventToCalendar } from '../services/api/event';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

function CalendarModal({ setIsModalOpen, title, content }) {
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 9);
  const formattedCurrentTime = currentTime.toISOString().slice(0, 16);

  const [summary, setSummary] = useState(title);
  const [description, setDescription] = useState(content.join('\n'));
  const [startDate, setStartDate] = useState(formattedCurrentTime);
  const [endDate, setEndDate] = useState(formattedCurrentTime);

  const [summaryError, setSummaryError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');

  const handleCancel = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    let hasError = false;
    if (!summary.trim()) { setSummaryError('제목을 입력해 주세요'); hasError = true; } else setSummaryError('');
    if (!description.trim()) { setDescriptionError('내용을 입력해 주세요'); hasError = true; } else setDescriptionError('');
    if (!startDate) { setStartDateError('시작 날짜를 선택해 주세요'); hasError = true; } else setStartDateError('');
    if (!endDate) { setEndDateError('종료 날짜를 선택해 주세요'); hasError = true; } else setEndDateError('');
    if (hasError) return;

    const formatDateTime = (datetime) => {
      if (datetime.includes(':')) {
        const [date, time] = datetime.split('T');
        const [hour, minute] = time.split(':');
        return `${date}T${hour}:${minute}:00`;
      }
      return `${datetime}:00`;
    };

    const eventData = {
      summary,
      description,
      startDate: formatDateTime(startDate) + '+09:00',
      endDate: formatDateTime(endDate) + '+09:00',
    };

    try {
      await addEventToCalendar(eventData);
      Swal.fire({ icon: 'success', title: '구글 캘린더 등록 성공', text: '구글캘린더에 이벤트가 등록되었습니다.' });
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({ icon: 'error', title: '구글 캘린더 등록 실패', text: '소셜로그인으로 로그인한 사용자만 이용가능한 서비스 입니다.' });
      console.error('There was an error submitting the event!', error);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (newStartDate > endDate) setEndDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (newEndDate < startDate) setStartDate(newEndDate);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && setIsModalOpen(false)}>
      <DialogContent showCloseButton={false} className="w-[90%] max-w-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">이벤트 캘린더 등록</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#191F28]">제목</label>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setSummary('')}
                className="h-6 px-2 text-xs"
              >
                초기화
              </Button>
            </div>
            <Input
              type="text"
              placeholder="제목을 입력해 주세요"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="border border-[#E5E8EB]"
            />
            {summaryError && <p className="text-red-500 text-xs">{summaryError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#191F28]">내용</label>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDescription('')}
                className="h-6 px-2 text-xs"
              >
                초기화
              </Button>
            </div>
            <textarea
              placeholder="내용을 입력해 주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-[#F2F4F6] px-4 py-3 text-sm text-[#191F28] font-medium placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6] resize-none transition-all border border-[#E5E8EB]"
            />
            {descriptionError && <p className="text-red-500 text-xs">{descriptionError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#191F28]">시작 날짜</label>
            <Input
              type="datetime-local"
              value={startDate}
              onChange={handleStartDateChange}
              className="border border-[#E5E8EB]"
            />
            {startDateError && <p className="text-red-500 text-xs">{startDateError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#191F28]">종료 날짜</label>
            <Input
              type="datetime-local"
              value={endDate}
              onChange={handleEndDateChange}
            />
            {endDateError && <p className="text-red-500 text-xs">{endDateError}</p>}
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            취소
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CalendarModal;
